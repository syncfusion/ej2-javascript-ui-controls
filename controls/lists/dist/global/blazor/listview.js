window.sf = window.sf || {};
var sflistview = (function (exports) {
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
// Effect Configuration Effect[] =  [fromViewBackward,fromViewForward,toViewBackward,toviewForward];
var effectsConfig = {
    'None': [],
    'SlideLeft': ['SlideRightOut', 'SlideLeftOut', 'SlideLeftIn', 'SlideRightIn'],
    'SlideDown': ['SlideTopOut', 'SlideBottomOut', 'SlideBottomIn', 'SlideTopIn'],
    'Zoom': ['FadeOut', 'FadeZoomOut', 'FadeZoomIn', 'FadeIn'],
    'Fade': ['FadeOut', 'FadeOut', 'FadeIn', 'FadeIn']
};
var effectsRTLConfig = {
    'None': [],
    'SlideLeft': ['SlideLeftOut', 'SlideRightOut', 'SlideRightIn', 'SlideLeftIn'],
    'SlideDown': ['SlideBottomOut', 'SlideTopOut', 'SlideTopIn', 'SlideBottomIn'],
    'Zoom': ['FadeZoomOut', 'FadeOut', 'FadeIn', 'FadeZoomIn'],
    'Fade': ['FadeOut', 'FadeOut', 'FadeIn', 'FadeIn']
};
// don't use space in classnames.
var classNames = {
    root: 'e-listview',
    hover: 'e-hover',
    selected: 'e-active',
    focused: 'e-focused',
    parentItem: 'e-list-parent',
    listItem: 'e-list-item',
    listIcon: 'e-list-icon',
    textContent: 'e-text-content',
    listItemText: 'e-list-text',
    groupListItem: 'e-list-group-item',
    hasChild: 'e-has-child',
    view: 'e-view',
    header: 'e-list-header',
    headerText: 'e-headertext',
    headerTemplateText: 'e-headertemplate-text',
    text: 'e-text',
    disable: 'e-disabled',
    content: 'e-content',
    icon: 'e-icons',
    backIcon: 'e-icon-back',
    checkboxWrapper: 'e-checkbox-wrapper',
    checkbox: 'e-checkbox',
    checked: 'e-check',
    checklist: 'e-checklist',
    checkboxIcon: 'e-frame',
    checkboxRight: 'e-checkbox-right',
    checkboxLeft: 'e-checkbox-left',
    listviewCheckbox: 'e-listview-checkbox',
    itemCheckList: 'e-checklist',
    virtualElementContainer: 'e-list-virtualcontainer'
};
var LISTVIEW_TEMPLATE_PROPERTY = 'Template';
var LISTVIEW_GROUPTEMPLATE_PROPERTY = 'GroupTemplate';
var LISTVIEW_HEADERTEMPLATE_PROPERTY = 'HeaderTemplate';
var swipeVelocity = 0.5;
/**
 * Represents the field settings of the ListView.
 */
var FieldSettings = /** @class */ (function (_super) {
    __extends(FieldSettings, _super);
    function FieldSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property('id')
    ], FieldSettings.prototype, "id", void 0);
    __decorate([
        sf.base.Property('text')
    ], FieldSettings.prototype, "text", void 0);
    __decorate([
        sf.base.Property('isChecked')
    ], FieldSettings.prototype, "isChecked", void 0);
    __decorate([
        sf.base.Property('isVisible')
    ], FieldSettings.prototype, "isVisible", void 0);
    __decorate([
        sf.base.Property('enabled')
    ], FieldSettings.prototype, "enabled", void 0);
    __decorate([
        sf.base.Property('iconCss')
    ], FieldSettings.prototype, "iconCss", void 0);
    __decorate([
        sf.base.Property('child')
    ], FieldSettings.prototype, "child", void 0);
    __decorate([
        sf.base.Property('tooltip')
    ], FieldSettings.prototype, "tooltip", void 0);
    __decorate([
        sf.base.Property('groupBy')
    ], FieldSettings.prototype, "groupBy", void 0);
    __decorate([
        sf.base.Property('text')
    ], FieldSettings.prototype, "sortBy", void 0);
    __decorate([
        sf.base.Property('htmlAttributes')
    ], FieldSettings.prototype, "htmlAttributes", void 0);
    __decorate([
        sf.base.Property('tableName')
    ], FieldSettings.prototype, "tableName", void 0);
    return FieldSettings;
}(sf.base.ChildProperty));
/**
 * Represents the EJ2 ListView control.
 * ```html
 * <div id="listview">
 * <ul>
 * <li>Favorite</li>
 * <li>Documents</li>
 * <li>Downloads</li>
 * </ul>
 * </div>
 * ```
 * ```typescript
 *   var listviewObject = new ListView({});
 *   listviewObject.appendTo("#listview");
 * ```
 */
var ListView = /** @class */ (function (_super) {
    __extends(ListView, _super);
    /**
     * Constructor for creating the widget
     */
    function ListView(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.itemReRender = false;
        _this.previousSelectedItems = [];
        _this.hiddenItems = [];
        _this.enabledItems = [];
        _this.disabledItems = [];
        return _this;
    }
    /**
     * @private
     */
    ListView.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'htmlAttributes':
                    this.setHTMLAttribute();
                    break;
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass);
                    break;
                case 'enable':
                    this.setEnable();
                    break;
                case 'width':
                case 'height':
                    this.setSize();
                    break;
                case 'enableRtl':
                    this.setEnableRTL();
                    break;
                case 'fields':
                    this.listBaseOption.fields = this.fields.properties;
                    if (this.enableVirtualization) {
                        if (!(this.isServerRendered && sf.base.isBlazor())) {
                            this.virtualizationModule.reRenderUiVirtualization();
                        }
                    }
                    else {
                        if (sf.base.isBlazor() && this.isServerRendered && !this.enableVirtualization) {
                            this.itemReRender = true;
                        }
                        this.reRender();
                    }
                    break;
                case 'headerTitle':
                    if (!this.curDSLevel.length) {
                        this.header(this.headerTitle, false, 'header');
                    }
                    break;
                case 'query':
                    if (this.enableVirtualization) {
                        if (!(sf.base.isBlazor() && this.isServerRendered)) {
                            this.virtualizationModule.reRenderUiVirtualization();
                        }
                    }
                    else {
                        if (sf.base.isBlazor() && this.isServerRendered && !this.enableVirtualization) {
                            this.itemReRender = true;
                        }
                        this.reRender();
                    }
                    break;
                case 'showHeader':
                    this.header(this.headerTitle, false, 'header');
                    break;
                case 'enableVirtualization':
                    if (!sf.base.isNullOrUndefined(this.contentContainer)) {
                        sf.base.detach(this.contentContainer);
                    }
                    this.refresh();
                    break;
                case 'showCheckBox':
                case 'checkBoxPosition':
                    if (!sf.base.isBlazor() || !this.isServerRendered) {
                        if (this.enableVirtualization) {
                            this.virtualizationModule.reRenderUiVirtualization();
                        }
                        else {
                            this.setCheckbox();
                        }
                    }
                    break;
                case 'dataSource':
                    if (this.enableVirtualization) {
                        if (!(this.isServerRendered && sf.base.isBlazor())) {
                            this.virtualizationModule.reRenderUiVirtualization();
                        }
                    }
                    else {
                        if (sf.base.isBlazor() && this.isServerRendered && !this.enableVirtualization) {
                            this.itemReRender = true;
                        }
                        this.reRender();
                    }
                    break;
                case 'sortOrder':
                case 'showIcon':
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        // tslint:disable
                        this.interopAdaptor.invokeMethodAsync('ItemSorting');
                        //tslint:enable
                    }
                    else {
                        if (this.enableVirtualization) {
                            this.virtualizationModule.reRenderUiVirtualization();
                        }
                        else {
                            this.listBaseOption.showIcon = this.showIcon;
                            this.curViewDS = this.getSubDS();
                            this.resetCurrentList();
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    };
    // Model Changes
    ListView.prototype.setHTMLAttribute = function () {
        if (Object.keys(this.htmlAttributes).length) {
            sf.base.attributes(this.element, this.htmlAttributes);
        }
    };
    ListView.prototype.setCSSClass = function (oldCSSClass) {
        if (this.cssClass) {
            sf.base.addClass([this.element], this.cssClass.split(' ').filter(function (css) { return css; }));
        }
        if (oldCSSClass) {
            sf.base.removeClass([this.element], oldCSSClass.split(' ').filter(function (css) { return css; }));
        }
    };
    ListView.prototype.setSize = function () {
        this.element.style.height = sf.base.formatUnit(this.height);
        this.element.style.width = sf.base.formatUnit(this.width);
        this.isWindow = this.element.clientHeight ? false : true;
    };
    ListView.prototype.setEnable = function () {
        this.enableElement(this.element, this.enable);
    };
    ListView.prototype.setEnableRTL = function () {
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        }
        else {
            this.element.classList.remove('e-rtl');
        }
    };
    ListView.prototype.enableElement = function (element, isEnabled) {
        if (isEnabled) {
            element.classList.remove(classNames.disable);
        }
        else {
            element.classList.add(classNames.disable);
        }
    };
    // Support Component Functions
    ListView.prototype.header = function (text, showBack, prop) {
        if (sf.base.isBlazor() && this.isServerRendered) {
            var args = { HeaderText: text, BackButton: showBack };
            // tslint:disable
            this.interopAdaptor.invokeMethodAsync('HeaderTitle', args);
            // tslint:disable
        }
        else {
            if (this.headerEle === undefined && this.showHeader) {
                if (this.enableHtmlSanitizer) {
                    this.setProperties({ headerTitle: sf.base.SanitizeHtmlHelper.sanitize(this.headerTitle) }, true);
                }
                this.headerEle = this.createElement('div', { className: classNames.header });
                var innerHeaderEle = this.createElement('span', { className: classNames.headerText, innerHTML: this.headerTitle });
                var textEle = this.createElement('div', { className: classNames.text, innerHTML: innerHeaderEle.outerHTML });
                var hedBackButton = this.createElement('div', {
                    className: classNames.icon + ' ' + classNames.backIcon + ' e-but-back',
                    attrs: { style: 'display:none;' }
                });
                this.headerEle.appendChild(hedBackButton);
                this.headerEle.appendChild(textEle);
                if (this.headerTemplate) {
                    var compiledString = sf.base.compile(this.headerTemplate);
                    var headerTemplateEle = this.createElement('div', { className: classNames.headerTemplateText });
                    // tslint:disable-next-line
                    var compiledElement = compiledString({}, this, prop, this.LISTVIEW_HEADERTEMPLATE_ID, null, null, this.headerEle);
                    if (compiledElement) {
                        sf.base.append(compiledElement, headerTemplateEle);
                    }
                    sf.base.append([headerTemplateEle], this.headerEle);
                    this.updateBlazorTemplates(false, true, true);
                    // tslint:disable-next-line
                    if (this.isReact) {
                        this.renderReactTemplates();
                    }
                }
                if (this.headerTemplate && this.headerTitle) {
                    textEle.classList.add('header');
                }
                this.element.classList.add('e-has-header');
                sf.base.prepend([this.headerEle], this.element);
            }
            else if (this.headerEle) {
                if (this.showHeader) {
                    this.headerEle.style.display = '';
                    var textEle = this.headerEle.querySelector('.' + classNames.headerText);
                    var hedBackButton = this.headerEle.querySelector('.' + classNames.backIcon);
                    if (this.enableHtmlSanitizer) {
                        text = sf.base.SanitizeHtmlHelper.sanitize(text);
                    }
                    textEle.innerHTML = text;
                    if (this.headerTemplate && showBack) {
                        textEle.parentElement.classList.remove('header');
                        this.headerEle.querySelector('.' + classNames.headerTemplateText).classList.add('nested-header');
                    }
                    if (this.headerTemplate && !showBack) {
                        textEle.parentElement.classList.add('header');
                        this.headerEle.querySelector('.' + classNames.headerTemplateText).classList.remove('nested-header');
                        this.headerEle.querySelector('.' + classNames.headerTemplateText).classList.add('header');
                    }
                    if (showBack === true) {
                        hedBackButton.style.display = '';
                    }
                    else {
                        hedBackButton.style.display = 'none';
                    }
                }
                else {
                    this.headerEle.style.display = 'none';
                }
            }
        }
    };
    // Animation Related Functions
    ListView.prototype.switchView = function (fromView, toView, reverse) {
        var _this = this;
        if (fromView && toView) {
            var fPos_1 = fromView.style.position;
            var overflow_1 = (this.element.style.overflow !== 'hidden') ? this.element.style.overflow : '';
            fromView.style.position = 'absolute';
            fromView.classList.add('e-view');
            var anim = void 0;
            var duration = this.animation.duration;
            if (this.animation.effect) {
                anim = (this.enableRtl ? effectsRTLConfig[this.animation.effect] : effectsConfig[this.animation.effect]);
            }
            else {
                var slideLeft = 'SlideLeft';
                anim = effectsConfig[slideLeft];
                reverse = this.enableRtl;
                duration = 0;
            }
            this.element.style.overflow = 'hidden';
            this.aniObj.animate(fromView, {
                name: (reverse === true ? anim[0] : anim[1]),
                duration: duration,
                timingFunction: this.animation.easing,
                end: function (model) {
                    fromView.style.display = 'none';
                    _this.element.style.overflow = overflow_1;
                    fromView.style.position = fPos_1;
                    fromView.classList.remove('e-view');
                }
            });
            toView.style.display = '';
            this.aniObj.animate(toView, {
                name: (reverse === true ? anim[2] : anim[3]),
                duration: duration,
                timingFunction: this.animation.easing,
                end: function () {
                    _this.trigger('actionComplete');
                }
            });
            this.curUL = toView;
        }
    };
    ListView.prototype.preRender = function () {
        if (this.template) {
            try {
                if (document.querySelectorAll(this.template).length) {
                    this.template = document.querySelector(this.template).innerHTML.trim();
                }
            }
            catch (e) {
                sf.base.compile(this.template);
                // tslint:disable-next-line
                if (this.isReact) {
                    this.renderReactTemplates();
                }
            }
        }
        this.listBaseOption = {
            template: this.template,
            headerTemplate: this.headerTemplate,
            groupTemplate: this.groupTemplate, expandCollapse: true, listClass: '',
            ariaAttributes: {
                itemRole: 'option', listRole: 'presentation', itemText: '',
                groupItemRole: 'group', wrapperRole: 'presentation'
            },
            fields: this.fields.properties, sortOrder: this.sortOrder, showIcon: this.showIcon,
            itemCreated: this.renderCheckbox.bind(this),
            templateID: "" + this.element.id + LISTVIEW_TEMPLATE_PROPERTY,
            groupTemplateID: "" + this.element.id + LISTVIEW_GROUPTEMPLATE_PROPERTY,
            enableHtmlSanitizer: this.enableHtmlSanitizer,
            removeBlazorID: true
        };
        this.initialization();
    };
    ListView.prototype.updateLiElementHeight = function () {
        var liContainer = this.element.querySelector('.' + classNames.virtualElementContainer);
        if (liContainer.children[0]) {
            this.liElementHeight = liContainer.children[0].getBoundingClientRect().height;
            // tslint:disable
            this.interopAdaptor.invokeMethodAsync('LiElementHeight', this.liElementHeight);
            // tslint:enable
        }
    };
    ListView.prototype.initialization = function () {
        if (sf.base.isBlazor() && this.isServerRendered && this.enableVirtualization) {
            var ulContainer = this.element.querySelector('.' + classNames.virtualElementContainer);
            if (ulContainer !== null) {
                if (this.height === '') {
                    // tslint:disable
                    this.interopAdaptor.invokeMethodAsync('SetComponentHeight', window.innerHeight);
                    // tslint:enable
                    this.isWindow = true;
                    ulContainer.scrollIntoView();
                }
                if (this.height.toString().indexOf('%') !== -1) {
                    // tslint:disable
                    this.interopAdaptor.invokeMethodAsync('SetContainerHeight', this.element.getBoundingClientRect().height.toString());
                    // tslint:enable
                }
                if (ulContainer.children[0]) {
                    this.liElementHeight = ulContainer.children[0].getBoundingClientRect().height;
                    // tslint:disable
                    this.interopAdaptor.invokeMethodAsync('LiElementHeight', this.liElementHeight);
                    // tslint:enable
                }
            }
        }
        this.curDSLevel = [];
        this.animateOptions = {};
        this.curViewDS = [];
        this.currentLiElements = [];
        this.isNestedList = false;
        this.selectedData = [];
        this.selectedId = [];
        this.LISTVIEW_TEMPLATE_ID = "" + this.element.id + LISTVIEW_TEMPLATE_PROPERTY;
        this.LISTVIEW_GROUPTEMPLATE_ID = "" + this.element.id + LISTVIEW_GROUPTEMPLATE_PROPERTY;
        this.LISTVIEW_HEADERTEMPLATE_ID = "" + this.element.id + LISTVIEW_HEADERTEMPLATE_PROPERTY;
        this.aniObj = new sf.base.Animation(this.animateOptions);
        this.removeElement(this.curUL);
        this.removeElement(this.ulElement);
        this.removeElement(this.headerEle);
        this.removeElement(this.contentContainer);
        // tslint:disable-next-line
        if (this.isReact) {
            this.clearTemplate();
        }
        this.curUL = this.ulElement = this.liCollection = this.headerEle = this.contentContainer = undefined;
    };
    ListView.prototype.renderCheckbox = function (args) {
        if (args.item.classList.contains(classNames.hasChild)) {
            this.isNestedList = true;
        }
        if (this.showCheckBox && this.isValidLI(args.item)) {
            var checkboxElement = void 0;
            var fieldData = void 0;
            checkboxElement = sf.buttons.createCheckBox(this.createElement, false, {
                checked: false, enableRtl: this.enableRtl,
                cssClass: classNames.listviewCheckbox
            });
            checkboxElement.setAttribute('role', 'checkbox');
            var frameElement_1 = checkboxElement.querySelector('.' + classNames.checkboxIcon);
            args.item.classList.add(classNames.itemCheckList);
            args.item.firstElementChild.classList.add(classNames.checkbox);
            if (typeof this.dataSource[0] !== 'string' && typeof this.dataSource[0] !== 'number') {
                fieldData = sf.lists.getFieldValues(args.curData, this.listBaseOption.fields);
                if (fieldData[this.listBaseOption.fields.isChecked]) {
                    this.checkInternally(args, checkboxElement);
                }
            }
            else if (((typeof this.dataSource[0] === 'string' ||
                typeof this.dataSource[0] === 'number') && this.selectedData.indexOf(args.text) !== -1)) {
                this.checkInternally(args, checkboxElement);
            }
            checkboxElement.setAttribute('aria-checked', frameElement_1.classList.contains(classNames.checked) ? 'true' : 'false');
            if (this.checkBoxPosition === 'Left') {
                checkboxElement.classList.add(classNames.checkboxLeft);
                args.item.firstElementChild.classList.add(classNames.checkboxLeft);
                args.item.firstElementChild.insertBefore(checkboxElement, args.item.firstElementChild.childNodes[0]);
            }
            else {
                checkboxElement.classList.add(classNames.checkboxRight);
                args.item.firstElementChild.classList.add(classNames.checkboxRight);
                args.item.firstElementChild.appendChild(checkboxElement);
            }
            this.currentLiElements.push(args.item);
            this.checkBoxPosition === 'Left' ? this.virtualCheckBox = args.item.firstElementChild.children[0] :
                this.virtualCheckBox = args.item.firstElementChild.lastElementChild;
        }
    };
    ListView.prototype.checkInternally = function (args, checkboxElement) {
        args.item.classList.add(classNames.selected);
        args.item.setAttribute('aria-selected', 'true');
        checkboxElement.querySelector('.' + classNames.checkboxIcon).classList.add(classNames.checked);
        checkboxElement.setAttribute('aria-checked', 'true');
    };
    /**
     * Checks the specific list item by passing the unchecked fields as an argument to this method.
     * @param  {Fields | HTMLElement | Element} item - It accepts Fields or HTML list element as an argument.
     */
    ListView.prototype.checkItem = function (item) {
        this.toggleCheckBase(item, true);
    };
    ListView.prototype.toggleCheckBase = function (item, checked) {
        if (this.showCheckBox) {
            var liElement = item;
            if (item instanceof Object && item.constructor !== HTMLLIElement) {
                liElement = this.getLiFromObjOrElement(item);
            }
            if (!sf.base.isNullOrUndefined(liElement)) {
                var checkboxIcon = liElement.querySelector('.' + classNames.checkboxIcon);
                checked ? liElement.classList.add(classNames.selected) : liElement.classList.remove(classNames.selected);
                liElement.setAttribute('aria-selected', checked ? 'true' : 'false');
                checked ? checkboxIcon.classList.add(classNames.checked) : checkboxIcon.classList.remove(classNames.checked);
                checkboxIcon.parentElement.setAttribute('aria-checked', checked ? 'true' : 'false');
            }
            this.setSelectedItemData(liElement);
        }
    };
    /**
     * Uncheck the specific list item by passing the checked fields as an argument to this method.
     * @param  {Fields | HTMLElement | Element} item - It accepts Fields or HTML list element as an argument.
     */
    ListView.prototype.uncheckItem = function (item) {
        this.toggleCheckBase(item, false);
    };
    /**
     * Checks all the unchecked items in the ListView.
     */
    ListView.prototype.checkAllItems = function () {
        this.toggleAllCheckBase(true);
    };
    /**
     * Uncheck all the checked items in ListView.
     */
    ListView.prototype.uncheckAllItems = function () {
        this.toggleAllCheckBase(false);
    };
    ListView.prototype.toggleAllCheckBase = function (checked) {
        if (this.showCheckBox) {
            for (var i = 0; i < this.liCollection.length; i++) {
                var checkIcon = this.liCollection[i].querySelector('.' + classNames.checkboxIcon);
                if (checkIcon) {
                    if (checked) {
                        if (!checkIcon.classList.contains(classNames.checked)) {
                            this.checkItem(this.liCollection[i]);
                        }
                    }
                    else {
                        if (checkIcon.classList.contains(classNames.checked)) {
                            this.uncheckItem(this.liCollection[i]);
                        }
                    }
                }
            }
            if (this.enableVirtualization) {
                this.virtualizationModule.checkedItem(checked);
            }
        }
    };
    ListView.prototype.setCheckbox = function () {
        if (this.showCheckBox) {
            var liCollection = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.listItem));
            var args = {
                item: undefined, curData: undefined, dataSource: undefined, fields: undefined,
                options: undefined, text: ''
            };
            for (var i = 0; i < liCollection.length; i++) {
                var element = liCollection[i];
                args.item = element;
                args.curData = this.getItemData(element);
                if (element.querySelector('.' + classNames.checkboxWrapper)) {
                    this.removeElement(element.querySelector('.' + classNames.checkboxWrapper));
                }
                this.renderCheckbox(args);
                if (args.item.classList.contains(classNames.selected)) {
                    this.checkInternally(args, args.item.querySelector('.' + classNames.checkboxWrapper));
                }
            }
        }
        else {
            var liCollection = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.itemCheckList));
            for (var i = 0; i < liCollection.length; i++) {
                var element = liCollection[i];
                element.classList.remove(classNames.selected);
                element.firstElementChild.classList.remove(classNames.checkbox);
                this.removeElement(element.querySelector('.' + classNames.checkboxWrapper));
            }
            if (this.selectedItems) {
                this.selectedItems.item.classList.add(classNames.selected);
            }
        }
    };
    /**
     * Refresh the height of the list item.
     */
    ListView.prototype.refreshItemHeight = function () {
        this.virtualizationModule.refreshItemHeight();
    };
    ListView.prototype.clickHandler = function (e) {
        var target = e.target;
        var classList = target.classList;
        var closestElement;
        if (classList.contains(classNames.backIcon) || classList.contains(classNames.headerText)) {
            if (this.showCheckBox && this.curDSLevel[this.curDSLevel.length - 1]) {
                this.uncheckAllItems();
            }
            this.back();
        }
        else {
            var li = sf.base.closest(target.parentNode, '.' + classNames.listItem);
            if (li === null) {
                li = target;
            }
            this.removeFocus();
            if (this.enable && this.showCheckBox && this.isValidLI(li)) {
                if (e.target.classList.contains(classNames.checkboxIcon)) {
                    li.classList.add(classNames.focused);
                    if (sf.base.isNullOrUndefined(li.querySelector('.' + classNames.checked))) {
                        var args = {
                            curData: undefined, dataSource: undefined, fields: undefined, options: undefined,
                            text: undefined, item: li
                        };
                        this.checkInternally(args, args.item.querySelector('.' + classNames.checkboxWrapper));
                    }
                    else {
                        this.uncheckItem(li);
                        li.classList.add(classNames.focused);
                    }
                    if (this.enableVirtualization) {
                        this.virtualizationModule.setCheckboxLI(li, e);
                    }
                    if (e) {
                        var eventArgs = this.selectEventData(li, e);
                        var checkIcon = li.querySelector('.' + classNames.checkboxIcon);
                        sf.base.merge(eventArgs, { isChecked: checkIcon.classList.contains(classNames.checked) });
                        this.trigger('select', eventArgs);
                    }
                }
                else if (li.classList.contains(classNames.hasChild)) {
                    this.removeHover();
                    this.removeSelect();
                    this.removeSelect(li);
                    this.setSelectLI(li, e);
                    li.classList.remove(classNames.selected);
                }
                else {
                    this.setCheckboxLI(li, e);
                }
            }
            else {
                this.setSelectLI(li, e);
            }
            closestElement = sf.base.closest(e.target, 'li');
            if (!sf.base.isNullOrUndefined(closestElement)) {
                if (closestElement.classList.contains('e-has-child') &&
                    !e.target.parentElement.classList.contains('e-listview-checkbox')) {
                    closestElement.classList.add(classNames.disable);
                }
            }
        }
        if (sf.base.isBlazor() && this.isServerRendered && this.enableVirtualization) {
            var ulElementContainer = this.element.querySelector('.' + classNames.virtualElementContainer);
            if (ulElementContainer.querySelector('.e-active')) {
                // tslint:disable-next-line:no-any
                var selectedElements = ulElementContainer.querySelectorAll('.e-active');
                // tslint:enable-next-line:no-any
                if (this.showCheckBox) {
                    for (var i = 0; i < selectedElements.length; i++) {
                        // tslint:disable-next-line:no-any
                        if (!this.previousSelectedItems.includes(selectedElements[i].getAttribute('data-uid'))) {
                            this.previousSelectedItems.push(selectedElements[i].getAttribute('data-uid'));
                        }
                        // tslint:enable-next-line:no-any
                    }
                }
                else {
                    this.previousSelectedItems[0] = (ulElementContainer.querySelector('.e-active').getAttribute('data-uid'));
                }
            }
            if (ulElementContainer.querySelector('.e-focused')) {
                // tslint:disable-next-line:no-any
                var focusElement = ulElementContainer.querySelector('.e-focused');
                // tslint:enable-next-line:no-any
                if (!focusElement.classList.contains('e-active')) {
                    var focusElementId = focusElement.getAttribute('data-uid');
                    // tslint:disable-next-line:no-any
                    if (this.previousSelectedItems.includes(focusElementId)) {
                        var selectedElement1 = this.previousSelectedItems.slice(0, this.previousSelectedItems.indexOf(focusElementId));
                        var selectedElement2 = this.previousSelectedItems.
                            slice(this.previousSelectedItems.indexOf(focusElementId) + 1, this.previousSelectedItems.length);
                        this.previousSelectedItems = selectedElement1.concat(selectedElement2);
                    }
                    // tslint:enable-next-line:no-any
                }
            }
        }
    };
    ListView.prototype.removeElement = function (element) {
        return element && element.parentNode && element.parentNode.removeChild(element);
    };
    ListView.prototype.hoverHandler = function (e) {
        var curLi = sf.base.closest(e.target.parentNode, '.' + classNames.listItem);
        this.setHoverLI(curLi);
    };
    ListView.prototype.leaveHandler = function (e) {
        this.removeHover();
    };
    
    ListView.prototype.homeKeyHandler = function (e, end) {
        if (Object.keys(this.dataSource).length && this.curUL) {
            if (this.selectedItems) {
                (this.selectedItems.item).setAttribute('aria-selected', 'false');
            }
            var li = this.curUL.querySelectorAll('.' + classNames.listItem);
            var focusedElement = this.curUL.querySelector('.' + classNames.focused) ||
                this.curUL.querySelector('.' + classNames.selected);
            if (focusedElement) {
                focusedElement.classList.remove(classNames.focused);
                if (!this.showCheckBox) {
                    focusedElement.classList.remove(classNames.selected);
                }
            }
            var index = !end ? 0 : li.length - 1;
            if (li[index].classList.contains(classNames.hasChild) || this.showCheckBox) {
                li[index].classList.add(classNames.focused);
            }
            else {
                this.setSelectLI(li[index], e);
            }
            if (li[index]) {
                this.element.setAttribute('aria-activedescendant', li[index].id.toString());
            }
            else {
                this.element.removeAttribute('aria-activedescendant');
            }
        }
    };
    ListView.prototype.onArrowKeyDown = function (e, prev) {
        var siblingLI;
        var li;
        var hasChild = !sf.base.isNullOrUndefined(this.curUL.querySelector('.' + classNames.hasChild)) ? true : false;
        if (hasChild || this.showCheckBox) {
            li = this.curUL.querySelector('.' + classNames.focused) || this.curUL.querySelector('.' + classNames.selected);
            siblingLI = sf.lists.ListBase.getSiblingLI(this.curUL.querySelectorAll('.' + classNames.listItem), li, prev);
            if (!sf.base.isNullOrUndefined(siblingLI)) {
                if (li) {
                    li.classList.remove(classNames.focused);
                    if (!this.showCheckBox) {
                        li.classList.remove(classNames.selected);
                    }
                }
                if (siblingLI.classList.contains(classNames.hasChild) || this.showCheckBox) {
                    siblingLI.classList.add(classNames.focused);
                }
                else {
                    this.setSelectLI(siblingLI, e);
                }
            }
        }
        else {
            li = this.curUL.querySelector('.' + classNames.selected);
            siblingLI = sf.lists.ListBase.getSiblingLI(this.curUL.querySelectorAll('.' + classNames.listItem), li, prev);
            this.setSelectLI(siblingLI, e);
        }
        if (siblingLI) {
            this.element.setAttribute('aria-activedescendant', siblingLI.id.toString());
        }
        else {
            this.element.removeAttribute('aria-activedescendant');
        }
        return siblingLI;
    };
    ListView.prototype.arrowKeyHandler = function (e, prev) {
        var _this = this;
        e.preventDefault();
        if (Object.keys(this.dataSource).length && this.curUL) {
            var siblingLI = this.onArrowKeyDown(e, prev);
            var elementTop = this.element.getBoundingClientRect().top;
            var elementHeight = this.element.getBoundingClientRect().height;
            var firstItemBounds = this.curUL.querySelector('.' + classNames.listItem).getBoundingClientRect();
            var heightDiff = void 0;
            var groupItemBounds = void 0;
            if (this.fields.groupBy) {
                groupItemBounds = this.curUL.querySelector('.' + classNames.groupListItem).getBoundingClientRect();
            }
            if (siblingLI) {
                var siblingTop = siblingLI.getBoundingClientRect().top;
                var siblingHeight = siblingLI.getBoundingClientRect().height;
                if (!prev) {
                    var height = this.isWindow ? window.innerHeight : elementHeight;
                    heightDiff = this.isWindow ? (siblingTop + siblingHeight) :
                        ((siblingTop - elementTop) + siblingHeight);
                    if (heightDiff > height) {
                        this.isWindow ? window.scroll(0, pageYOffset + (heightDiff - height)) :
                            this.element.scrollTop = this.element.scrollTop + (heightDiff - height);
                    }
                }
                else {
                    heightDiff = this.isWindow ? siblingTop : (siblingTop - elementTop);
                    if (heightDiff < 0) {
                        this.isWindow ? window.scroll(0, pageYOffset + heightDiff) :
                            this.element.scrollTop = this.element.scrollTop + heightDiff;
                    }
                }
            }
            else if (this.enableVirtualization && prev && this.virtualizationModule.uiFirstIndex) {
                this.onUIScrolled = function () {
                    _this.onArrowKeyDown(e, prev);
                    _this.onUIScrolled = undefined;
                };
                heightDiff = this.virtualizationModule.listItemHeight;
                this.isWindow ? window.scroll(0, pageYOffset - heightDiff) :
                    this.element.scrollTop = this.element.scrollTop - heightDiff;
            }
            else if (prev) {
                if (this.showHeader && this.headerEle) {
                    var topHeight = groupItemBounds ? groupItemBounds.top : firstItemBounds.top;
                    var headerBounds = this.headerEle.getBoundingClientRect();
                    heightDiff = headerBounds.top < 0 ? (headerBounds.height - topHeight) : 0;
                    this.isWindow ? window.scroll(0, pageYOffset - heightDiff)
                        : this.element.scrollTop = 0;
                }
                else if (this.fields.groupBy) {
                    heightDiff = this.isWindow ? (groupItemBounds.top < 0 ? groupItemBounds.top : 0) :
                        (elementTop - firstItemBounds.top) + groupItemBounds.height;
                    this.isWindow ? window.scroll(0, pageYOffset + heightDiff) :
                        this.element.scrollTop = this.element.scrollTop - heightDiff;
                }
            }
        }
    };
    ListView.prototype.enterKeyHandler = function (e) {
        if (Object.keys(this.dataSource).length && this.curUL) {
            var hasChild = !sf.base.isNullOrUndefined(this.curUL.querySelector('.' + classNames.hasChild)) ? true : false;
            var li = this.curUL.querySelector('.' + classNames.focused);
            if (hasChild && li) {
                li.classList.remove(classNames.focused);
                if (this.showCheckBox) {
                    this.removeSelect();
                    this.removeSelect(li);
                    this.removeHover();
                }
                this.setSelectLI(li, e);
            }
        }
    };
    ListView.prototype.spaceKeyHandler = function (e) {
        if (this.enable && this.showCheckBox && Object.keys(this.dataSource).length && this.curUL) {
            var li = this.curUL.querySelector('.' + classNames.focused);
            if (!sf.base.isNullOrUndefined(li) && sf.base.isNullOrUndefined(li.querySelector('.' + classNames.checked))) {
                var args = {
                    curData: undefined, dataSource: undefined, fields: undefined, options: undefined,
                    text: undefined, item: li
                };
                this.checkInternally(args, args.item.querySelector('.' + classNames.checkboxWrapper));
            }
            else {
                this.uncheckItem(li);
            }
        }
    };
    ListView.prototype.keyActionHandler = function (e) {
        switch (e.keyCode) {
            case 36:
                this.homeKeyHandler(e);
                break;
            case 35:
                this.homeKeyHandler(e, true);
                break;
            case 40:
                this.arrowKeyHandler(e);
                break;
            case 38:
                this.arrowKeyHandler(e, true);
                break;
            case 13:
                this.enterKeyHandler(e);
                break;
            case 8:
                if (this.showCheckBox && this.curDSLevel[this.curDSLevel.length - 1]) {
                    this.uncheckAllItems();
                }
                this.back();
                break;
            case 32:
                this.spaceKeyHandler(e);
                break;
        }
    };
    ListView.prototype.swipeActionHandler = function (e) {
        if (e.swipeDirection === 'Right' && e.velocity > swipeVelocity && e.originalEvent.type === 'touchend') {
            if (this.showCheckBox && this.curDSLevel[this.curDSLevel.length - 1]) {
                this.uncheckAllItems();
            }
            this.back();
        }
    };
    ListView.prototype.focusout = function () {
        if (Object.keys(this.dataSource).length && this.curUL) {
            var focusedElement = this.curUL.querySelector('.' + classNames.focused);
            var activeElement = this.curUL.querySelector('[aria-selected = true]');
            if (focusedElement) {
                focusedElement.classList.remove(classNames.focused);
                if (activeElement && !this.showCheckBox) {
                    activeElement.classList.add(classNames.selected);
                }
            }
        }
    };
    ListView.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.element, 'keydown', this.keyActionHandler, this);
        sf.base.EventHandler.add(this.element, 'click', this.clickHandler, this);
        sf.base.EventHandler.add(this.element, 'mouseover', this.hoverHandler, this);
        sf.base.EventHandler.add(this.element, 'mouseout', this.leaveHandler, this);
        sf.base.EventHandler.add(this.element, 'focusout', this.focusout, this);
        this.touchModule = new sf.base.Touch(this.element, { swipe: this.swipeActionHandler.bind(this) });
    };
    ListView.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(this.element, 'click', this.clickHandler);
        sf.base.EventHandler.remove(this.element, 'mouseover', this.hoverHandler);
        sf.base.EventHandler.remove(this.element, 'mouseout', this.leaveHandler);
        sf.base.EventHandler.remove(this.element, 'mouseover', this.hoverHandler);
        sf.base.EventHandler.remove(this.element, 'mouseout', this.leaveHandler);
        this.touchModule.destroy();
    };
    ListView.prototype.removeFocus = function () {
        var focusedLI = this.element.querySelectorAll('.' + classNames.focused);
        for (var _i = 0, focusedLI_1 = focusedLI; _i < focusedLI_1.length; _i++) {
            var ele = focusedLI_1[_i];
            ele.classList.remove(classNames.focused);
        }
    };
    ListView.prototype.removeHover = function () {
        var hoverLI = this.element.querySelector('.' + classNames.hover);
        if (hoverLI) {
            hoverLI.classList.remove(classNames.hover);
        }
    };
    ListView.prototype.removeSelect = function (li) {
        if (sf.base.isNullOrUndefined(li)) {
            var selectedLI = this.element.querySelectorAll('.' + classNames.selected);
            for (var _i = 0, selectedLI_1 = selectedLI; _i < selectedLI_1.length; _i++) {
                var ele = selectedLI_1[_i];
                if (this.showCheckBox && ele.querySelector('.' + classNames.checked)) {
                    continue;
                }
                else {
                    ele.setAttribute('aria-selected', 'false');
                    ele.classList.remove(classNames.selected);
                }
            }
        }
        else {
            li.classList.remove(classNames.selected);
            li.setAttribute('aria-selected', 'false');
        }
    };
    ListView.prototype.isValidLI = function (li) {
        return (li && li.classList.contains(classNames.listItem)
            && !li.classList.contains(classNames.groupListItem)
            && !li.classList.contains(classNames.disable));
    };
    ListView.prototype.setCheckboxLI = function (li, e) {
        if (this.isValidLI(li) && this.enable && this.showCheckBox) {
            if (this.curUL.querySelector('.' + classNames.focused)) {
                this.curUL.querySelector('.' + classNames.focused).classList.remove(classNames.focused);
            }
            li.classList.add(classNames.focused);
            var checkboxElement = li.querySelector('.' + classNames.checkboxWrapper);
            var checkIcon = checkboxElement.querySelector('.' + classNames.checkboxIcon + '.' + classNames.icon);
            this.removeHover();
            if (!checkIcon.classList.contains(classNames.checked)) {
                checkIcon.classList.add(classNames.checked);
                li.classList.add(classNames.selected);
                li.setAttribute('aria-selected', 'true');
            }
            else {
                checkIcon.classList.remove(classNames.checked);
                li.classList.remove(classNames.selected);
                li.setAttribute('aria-selected', 'false');
            }
            checkboxElement.setAttribute('aria-checked', checkIcon.classList.contains(classNames.checked) ?
                'true' : 'false');
            var eventArgs = this.selectEventData(li, e);
            sf.base.merge(eventArgs, { isChecked: checkIcon.classList.contains(classNames.checked) });
            if (this.enableVirtualization) {
                this.virtualizationModule.setCheckboxLI(li, e);
            }
            this.trigger('select', eventArgs);
            this.setSelectedItemData(li);
            this.renderSubList(li);
        }
    };
    ListView.prototype.selectEventData = function (li, e) {
        var data = this.getItemData(li);
        var fieldData = sf.lists.getFieldValues(data, this.listBaseOption.fields);
        var selectedItem;
        if (!sf.base.isNullOrUndefined(data)
            && typeof this.dataSource[0] === 'string' || typeof this.dataSource[0] === 'number') {
            selectedItem = { item: li, text: li && li.innerText.trim(), data: this.dataSource };
        }
        else {
            selectedItem = { item: li, text: fieldData && fieldData[this.listBaseOption.fields.text], data: data };
        }
        var eventArgs = {};
        sf.base.merge(eventArgs, selectedItem);
        if (e) {
            sf.base.merge(eventArgs, { isInteracted: true, event: e, index: this.curUL && Array.prototype.indexOf.call(this.curUL.children, li) });
        }
        return eventArgs;
    };
    ListView.prototype.setSelectedItemData = function (li) {
        var data = this.getItemData(li);
        var fieldData = sf.lists.getFieldValues(data, this.listBaseOption.fields);
        if (!sf.base.isNullOrUndefined(data) && ((typeof this.dataSource[0] === 'string') ||
            (typeof this.dataSource[0] === 'number'))) {
            this.selectedItems = {
                item: li,
                text: li && li.innerText.trim(),
                data: this.dataSource
            };
        }
        else {
            this.selectedItems = {
                item: li,
                text: fieldData && fieldData[this.listBaseOption.fields.text],
                data: data
            };
        }
    };
    ListView.prototype.setSelectLI = function (li, e) {
        if (this.isValidLI(li) && !li.classList.contains(classNames.selected) && this.enable) {
            if (!this.showCheckBox) {
                this.removeSelect();
            }
            li.classList.add(classNames.selected);
            li.setAttribute('aria-selected', 'true');
            this.removeHover();
            this.setSelectedItemData(li);
            if (this.enableVirtualization) {
                this.virtualizationModule.setSelectLI(li, e);
            }
            var eventArgs = this.selectEventData(li, e);
            this.trigger('select', eventArgs);
            this.selectedLI = li;
            this.renderSubList(li);
        }
    };
    ListView.prototype.setHoverLI = function (li) {
        if (this.isValidLI(li) && !li.classList.contains(classNames.hover) && this.enable) {
            var lastLi = this.element.querySelectorAll('.' + classNames.hover);
            if (lastLi && lastLi.length) {
                sf.base.removeClass(lastLi, classNames.hover);
            }
            if (!li.classList.contains(classNames.selected) || this.showCheckBox) {
                li.classList.add(classNames.hover);
            }
        }
    };
    //Data Source Related Functions
    ListView.prototype.getSubDS = function () {
        var levelKeys = this.curDSLevel;
        if (levelKeys.length) {
            var ds = this.localData;
            for (var _i = 0, levelKeys_1 = levelKeys; _i < levelKeys_1.length; _i++) {
                var key = levelKeys_1[_i];
                var field = {};
                field[this.fields.id] = key;
                this.curDSJSON = this.findItemFromDS(ds, field);
                var fieldData = sf.lists.getFieldValues(this.curDSJSON, this.listBaseOption.fields);
                ds = this.curDSJSON ? fieldData[this.fields.child] : ds;
            }
            return ds;
        }
        return this.localData;
    };
    ListView.prototype.getItemData = function (li) {
        var dataSource = this.dataSource instanceof sf.data.DataManager ?
            this.localData : this.dataSource;
        var fields = this.getElementUID(li);
        var curDS;
        if (sf.base.isNullOrUndefined(this.element.querySelector('.' + classNames.hasChild)) && this.fields.groupBy) {
            curDS = this.curViewDS;
        }
        else {
            curDS = dataSource;
        }
        return this.findItemFromDS(curDS, fields);
    };
    ListView.prototype.findItemFromDS = function (dataSource, fields, parent) {
        var _this = this;
        var resultJSON;
        if (dataSource && dataSource.length && fields) {
            dataSource.some(function (data) {
                var fieldData = sf.lists.getFieldValues(data, _this.listBaseOption.fields);
                //(!(fid) || id === fid) && (!(ftext) || text === ftext) && (!!fid || !!ftext)
                if ((fields[_this.fields.id] || fields[_this.fields.text]) &&
                    (!fields[_this.fields.id] || (!sf.base.isNullOrUndefined(fieldData[_this.fields.id]) &&
                        fieldData[_this.fields.id].toString()) === fields[_this.fields.id].toString()) &&
                    (!fields[_this.fields.text] || fieldData[_this.fields.text] === fields[_this.fields.text])) {
                    resultJSON = (parent ? dataSource : data);
                }
                else if (typeof data !== 'object' && dataSource.indexOf(data) !== -1) {
                    resultJSON = (parent ? dataSource : data);
                }
                else if (!sf.base.isNullOrUndefined(fields[_this.fields.id]) && sf.base.isNullOrUndefined(fieldData[_this.fields.id])) {
                    var li = _this.element.querySelector('[data-uid="'
                        + fields[_this.fields.id] + '"]');
                    if (li && li.innerText.trim() === fieldData[_this.fields.text]) {
                        resultJSON = data;
                    }
                }
                else if (fieldData.hasOwnProperty(_this.fields.child) && fieldData[_this.fields.child].length) {
                    resultJSON = _this.findItemFromDS(fieldData[_this.fields.child], fields, parent);
                }
                return !!resultJSON;
            });
        }
        else {
            resultJSON = dataSource;
        }
        return resultJSON;
    };
    ListView.prototype.getQuery = function () {
        var columns = [];
        var query = (this.query ? this.query : new sf.data.Query());
        if (!this.query) {
            for (var _i = 0, _a = Object.keys(this.fields.properties); _i < _a.length; _i++) {
                var column = _a[_i];
                if (column !== 'tableName' && !!(this.fields[column]) &&
                    this.fields[column] !==
                        sf.lists.ListBase.defaultMappedFields[column]
                    && columns.indexOf(this.fields[column]) === -1) {
                    columns.push(this.fields[column]);
                }
            }
            query.select(columns);
            if (this.fields.properties.hasOwnProperty('tableName')) {
                query.from(this.fields.tableName);
            }
        }
        return query;
    };
    ListView.prototype.setViewDataSource = function (dataSource) {
        if (dataSource === void 0) { dataSource = this.localData; }
        if (dataSource && this.fields.groupBy) {
            if (this.sortOrder !== 'None') {
                this.curViewDS = sf.lists.ListBase.groupDataSource(sf.lists.ListBase.getDataSource(dataSource, sf.lists.ListBase.addSorting(this.sortOrder, this.fields.sortBy)), this.listBaseOption.fields, this.sortOrder);
            }
            else {
                this.curViewDS = sf.lists.ListBase.groupDataSource(dataSource, this.listBaseOption.fields, this.sortOrder);
            }
        }
        else if (dataSource && this.sortOrder !== 'None') {
            this.curViewDS = sf.lists.ListBase.getDataSource(dataSource, sf.lists.ListBase.addSorting(this.sortOrder, this.fields.sortBy));
        }
        else {
            this.curViewDS = dataSource;
        }
    };
    ListView.prototype.isInAnimation = function () {
        return this.curUL.classList.contains('.e-animate');
    };
    ListView.prototype.setLocalData = function () {
        var _this = this;
        this.trigger('actionBegin');
        var listViewComponent = this;
        if (this.dataSource instanceof sf.data.DataManager) {
            this.dataSource.executeQuery(this.getQuery()).then(function (e) {
                if (_this.isDestroyed) {
                    return;
                }
                _this.localData = e.result;
                if (!_this.isServerRendered || (!sf.base.isBlazor())) {
                    listViewComponent.removeElement(listViewComponent.contentContainer);
                    if (_this.isReact) {
                        _this.clearTemplate();
                    }
                }
                _this.renderList();
                _this.trigger('actionComplete', e);
            }).catch(function (e) {
                if (_this.isDestroyed) {
                    return;
                }
                _this.trigger('actionFailure', e);
            });
        }
        else if (!this.dataSource || !this.dataSource.length) {
            var ul = this.element.querySelector('ul');
            if (ul) {
                sf.base.remove(ul);
                this.setProperties({ dataSource: sf.lists.ListBase.createJsonFromElement(ul) }, true);
                this.localData = this.dataSource;
                this.renderList();
                this.trigger('actionComplete', { data: this.localData });
            }
        }
        else {
            this.localData = this.dataSource;
            this.renderList();
            this.trigger('actionComplete', { data: this.localData });
        }
    };
    ListView.prototype.reRender = function () {
        if (!sf.base.isBlazor() || !this.isServerRendered || this.enableVirtualization) {
            this.resetBlazorTemplates();
            this.removeElement(this.headerEle);
            this.removeElement(this.ulElement);
            this.removeElement(this.contentContainer);
            if (this.isReact) {
                this.clearTemplate();
            }
            if (Object.keys(window).indexOf('ejsInterop') === -1) {
                this.element.innerHTML = '';
            }
            this.headerEle = this.ulElement = this.liCollection = undefined;
            this.header();
        }
        this.setLocalData();
    };
    ListView.prototype.resetCurrentList = function () {
        this.resetBlazorTemplates();
        this.setViewDataSource(this.curViewDS);
        this.contentContainer.innerHTML = '';
        this.createList();
        this.renderIntoDom(this.curUL);
    };
    ListView.prototype.setAttributes = function (liElements) {
        for (var i = 0; i < liElements.length; i++) {
            var element = liElements[i];
            if (element.classList.contains('e-list-item')) {
                element.setAttribute('id', this.element.id + '_' + element.getAttribute('data-uid'));
                element.setAttribute('aria-selected', 'false');
                element.setAttribute('tabindex', '-1');
            }
        }
    };
    ListView.prototype.createList = function () {
        this.currentLiElements = [];
        this.isNestedList = false;
        this.ulElement = this.curUL = sf.lists.ListBase.createList(this.createElement, this.curViewDS, this.listBaseOption, null, this);
        this.liCollection = this.curUL.querySelectorAll('.' + classNames.listItem);
        this.setAttributes(this.liCollection);
        this.updateBlazorTemplates(true);
    };
    ListView.prototype.resetBlazorTemplates = function () {
        // tslint:disable-next-line:no-any
        var templateCollection = sf.base.blazorTemplates;
        if (this.template) {
            templateCollection[this.LISTVIEW_TEMPLATE_ID] = [];
            sf.base.resetBlazorTemplate(this.LISTVIEW_TEMPLATE_ID, LISTVIEW_TEMPLATE_PROPERTY);
        }
        if (this.groupTemplate) {
            templateCollection[this.LISTVIEW_GROUPTEMPLATE_ID] = [];
            sf.base.resetBlazorTemplate(this.LISTVIEW_GROUPTEMPLATE_ID, LISTVIEW_GROUPTEMPLATE_PROPERTY);
        }
        if (this.headerTemplate) {
            sf.base.resetBlazorTemplate(this.LISTVIEW_HEADERTEMPLATE_ID, LISTVIEW_HEADERTEMPLATE_PROPERTY);
        }
    };
    ListView.prototype.updateBlazorTemplates = function (template, headerTemplate, resetExistingElements) {
        if (template === void 0) { template = false; }
        if (headerTemplate === void 0) { headerTemplate = false; }
        if (resetExistingElements === void 0) { resetExistingElements = false; }
        if (this.template && template && !this.enableVirtualization) {
            sf.base.updateBlazorTemplate(this.LISTVIEW_TEMPLATE_ID, LISTVIEW_TEMPLATE_PROPERTY, this, resetExistingElements);
        }
        if (this.groupTemplate && template && !this.enableVirtualization) {
            sf.base.updateBlazorTemplate(this.LISTVIEW_GROUPTEMPLATE_ID, LISTVIEW_GROUPTEMPLATE_PROPERTY, this, resetExistingElements);
        }
        if (this.headerTemplate && headerTemplate) {
            sf.base.updateBlazorTemplate(this.LISTVIEW_HEADERTEMPLATE_ID, LISTVIEW_HEADERTEMPLATE_PROPERTY, this, resetExistingElements);
        }
    };
    ListView.prototype.exceptionEvent = function (e) {
        this.trigger('actionFailure', e);
    };
    ListView.prototype.UpdateCurrentUL = function () {
        this.ulElement = this.curUL = this.element.querySelector('.' + classNames.parentItem);
        if (this.curUL) {
            // tslint:disable
            this.liCollection = this.curUL.querySelectorAll('.' + classNames.listItem);
            // tslint:enable
        }
    };
    ListView.prototype.removeActiveClass = function () {
        var listViewComponent = this;
        setTimeout(function () {
            var ulContainer = listViewComponent.element.querySelector('.' + classNames.virtualElementContainer);
            for (var i = 0; i < ulContainer.childElementCount; i++) {
                var selectedElement = ulContainer.children[i];
                var elementIndex = void 0;
                var hiddenElementIndex = void 0;
                if (listViewComponent.showCheckBox) {
                    if (listViewComponent.previousSelectedItems.length > 0) {
                        for (var j = 0; j < listViewComponent.previousSelectedItems.length; j++) {
                            if (selectedElement.getAttribute('data-uid') === listViewComponent.previousSelectedItems[j]) {
                                selectedElement.classList.add('e-active');
                                selectedElement.setAttribute('aria-selected', 'true');
                                if (selectedElement.querySelector('.e-frame.e-icons')) {
                                    selectedElement.querySelector('.e-frame.e-icons').classList.add('e-check');
                                }
                                elementIndex = i;
                            }
                            else {
                                if (elementIndex !== i) {
                                    selectedElement.classList.remove('e-active');
                                    selectedElement.removeAttribute('aria-selected');
                                    if (selectedElement.querySelector('.e-check')) {
                                        selectedElement.querySelector('.e-check').classList.remove('e-check');
                                    }
                                }
                            }
                        }
                    }
                    else {
                        selectedElement.classList.remove('e-active');
                        selectedElement.removeAttribute('aria-selected');
                        if (selectedElement.querySelector('.e-check')) {
                            selectedElement.querySelector('.e-check').classList.remove('e-check');
                        }
                    }
                }
                else {
                    if (selectedElement.getAttribute('data-uid') === listViewComponent.previousSelectedItems[0]) {
                        selectedElement.classList.add('e-active');
                        selectedElement.setAttribute('aria-selected', 'true');
                    }
                    else {
                        selectedElement.classList.remove('e-active');
                        selectedElement.removeAttribute('aria-selected');
                    }
                }
                if (listViewComponent.hiddenItems.length > 0) {
                    for (var k = 0; k < listViewComponent.hiddenItems.length; k++) {
                        if (selectedElement.getAttribute('data-uid') === listViewComponent.previousSelectedItems[k]) {
                            selectedElement.style.display = 'none';
                            hiddenElementIndex = i;
                        }
                        else {
                            if (hiddenElementIndex !== i) {
                                selectedElement.style.display = null;
                            }
                        }
                    }
                }
                if (listViewComponent.enabledItems.length > 0) {
                    for (var x = 0; x < listViewComponent.enabledItems.length; x++) {
                        if (selectedElement.getAttribute('data-uid') === listViewComponent.enabledItems[x]) {
                            if (selectedElement.classList.contains('e-disabled')) {
                                selectedElement.classList.remove('e-disabled');
                            }
                        }
                    }
                }
                if (listViewComponent.disabledItems.length > 0) {
                    for (var y = 0; y < listViewComponent.disabledItems.length; y++) {
                        if (selectedElement.getAttribute('data-uid') === listViewComponent.disabledItems[y]) {
                            if (!selectedElement.classList.contains('e-disabled')) {
                                selectedElement.classList.add('e-disabled');
                            }
                        }
                    }
                }
            }
        }, 200);
    };
    ListView.prototype.renderingNestedList = function () {
        var ul = sf.base.closest(this.liElement.parentNode, '.' + classNames.parentItem);
        var ctrlId = this.element.id;
        var ulElement = document.getElementById(ctrlId);
        var currentListItem = ulElement.getElementsByTagName('UL')[ulElement.getElementsByTagName('UL').length - 1];
        this.switchView(ul, currentListItem);
        this.liElement = null;
    };
    ListView.prototype.renderSubList = function (li) {
        this.liElement = li;
        var uID = li.getAttribute('data-uid');
        if (li.classList.contains(classNames.hasChild) && uID) {
            var ul = sf.base.closest(li.parentNode, '.' + classNames.parentItem);
            var ele = this.element.querySelector('[pid=\'' + uID + '\']');
            this.curDSLevel.push(uID);
            this.setViewDataSource(this.getSubDS());
            if (!ele) {
                var data = this.curViewDS;
                if (sf.base.isBlazor() && this.isServerRendered) {
                    // tslint:disable
                    this.interopAdaptor.invokeMethodAsync('ListChildDataSource', data);
                    // tslint:enable
                }
                else {
                    ele = sf.lists.ListBase.createListFromJson(this.createElement, data, this.listBaseOption, this.curDSLevel.length, null, this);
                    // tslint:disable-next-line
                    if (this.isReact) {
                        this.renderReactTemplates();
                    }
                    var lists = ele.querySelectorAll('.' + classNames.listItem);
                    this.setAttributes(lists);
                    ele.setAttribute('pID', uID);
                    ele.style.display = 'none';
                    this.renderIntoDom(ele);
                    this.updateBlazorTemplates(true);
                }
            }
            if (!sf.base.isBlazor() || !this.isServerRendered || this.enableVirtualization) {
                this.switchView(ul, ele);
            }
            this.liCollection = this.curUL.querySelectorAll('.' + classNames.listItem);
            if (this.selectedItems) {
                var fieldData = sf.lists.getFieldValues(this.selectedItems.data, this.listBaseOption.fields);
                this.header((fieldData[this.listBaseOption.fields.text]), true, 'header');
            }
            this.selectedLI = undefined;
        }
    };
    ListView.prototype.renderIntoDom = function (ele) {
        this.contentContainer.appendChild(ele);
    };
    ListView.prototype.renderList = function (data) {
        this.setViewDataSource(data);
        if (!sf.base.isBlazor() || !this.isServerRendered || this.enableVirtualization) {
            if (this.enableVirtualization) {
                if (Object.keys(this.dataSource).length) {
                    if (!(sf.base.isBlazor() && this.isServerRendered)) {
                        if ((this.template || this.groupTemplate) && !this.virtualizationModule.isNgTemplate()) {
                            this.listBaseOption.template = null;
                            this.listBaseOption.groupTemplate = null;
                            this.listBaseOption.itemCreated = this.virtualizationModule.createUIItem.bind(this.virtualizationModule);
                        }
                    }
                }
                this.virtualizationModule.uiVirtualization();
            }
            else {
                this.createList();
                this.contentContainer = this.createElement('div', { className: classNames.content });
                this.element.appendChild(this.contentContainer);
                this.renderIntoDom(this.ulElement);
                // tslint:disable-next-line
                if (this.isReact) {
                    this.renderReactTemplates();
                }
            }
        }
    };
    ListView.prototype.getElementUID = function (obj) {
        var fields = {};
        if (obj instanceof Element) {
            fields[this.fields.id] = obj.getAttribute('data-uid');
        }
        else {
            fields = obj;
        }
        return fields;
    };
    /**
     * Initializes the ListView component rendering.
     */
    ListView.prototype.render = function () {
        if (!sf.base.isBlazor() || !this.isServerRendered) {
            this.element.classList.add(classNames.root);
            sf.base.attributes(this.element, { role: 'list', tabindex: '0' });
            this.setCSSClass();
            this.setEnableRTL();
            this.setEnable();
            this.setSize();
            this.wireEvents();
            this.header();
            this.setLocalData();
            this.setHTMLAttribute();
            // tslint:disable-next-line
            if (this.isReact) {
                this.renderReactTemplates();
            }
        }
        else {
            this.initBlazor(true);
        }
        this.rippleFn = sf.base.rippleEffect(this.element, {
            selector: '.' + classNames.listItem
        });
        this.renderComplete();
    };
    ListView.prototype.initBlazor = function (firstRender) {
        if (firstRender === null) {
            firstRender = false;
        }
        this.setLocalData();
        this.setViewDataSource(this.localData);
        this.contentContainer = this.element.querySelector('.' + classNames.content);
        if (firstRender) {
            this.wireEvents();
        }
    };
    /**
     * It is used to destroy the ListView component.
     */
    ListView.prototype.destroy = function () {
        this.resetBlazorTemplates();
        // tslint:disable-next-line
        if (this.isReact) {
            this.clearTemplate();
        }
        this.unWireEvents();
        var classAr = [classNames.root, classNames.disable, 'e-rtl',
            'e-has-header', 'e-lib'].concat(this.cssClass.split(' ').filter(function (css) { return css; }));
        sf.base.removeClass([this.element], classAr);
        this.element.removeAttribute('role');
        this.element.removeAttribute('tabindex');
        this.curUL = this.ulElement = this.liCollection = this.headerEle = undefined;
        if (!(sf.base.isBlazor() && this.isServerRendered)) {
            this.element.innerHTML = '';
            _super.prototype.destroy.call(this);
        }
        else {
            this.element.style.display = 'none';
        }
    };
    /**
     * Switches back from the navigated sub list item.
     */
    ListView.prototype.back = function () {
        var pID = this.curDSLevel[this.curDSLevel.length - 1];
        if (pID === undefined || this.isInAnimation()) {
            return;
        }
        this.curDSLevel.pop();
        this.setViewDataSource(this.getSubDS());
        var toUL = this.element.querySelector('[data-uid=\'' + pID + '\']');
        var fromUL = this.curUL;
        if (!toUL) {
            this.createList();
            this.renderIntoDom(this.ulElement);
            toUL = this.curUL;
        }
        else {
            if (sf.base.isBlazor() && this.isServerRendered && this.enableVirtualization) {
                toUL = toUL.parentElement.parentElement.parentElement;
            }
            else {
                toUL = toUL.parentElement;
            }
        }
        var fieldData = sf.lists.getFieldValues(this.curDSJSON, this.listBaseOption.fields);
        var text = fieldData[this.fields.text];
        this.switchView(fromUL, toUL, true);
        this.removeFocus();
        var li = this.element.querySelector('[data-uid=\'' + pID + '\']');
        li.classList.remove(classNames.disable);
        li.classList.add(classNames.focused);
        if (this.showCheckBox && li.querySelector('.' + classNames.checkboxIcon).classList.contains(classNames.checked)) {
            li.setAttribute('aria-selected', 'true');
        }
        else {
            li.classList.remove(classNames.selected);
            li.setAttribute('aria-selected', 'false');
        }
        this.liCollection = this.curUL.querySelectorAll('.' + classNames.listItem);
        if (this.enableHtmlSanitizer) {
            this.setProperties({ headerTitle: sf.base.SanitizeHtmlHelper.sanitize(this.headerTitle) }, true);
        }
        this.header((this.curDSLevel.length ? text : this.headerTitle), (this.curDSLevel.length ? true : false), 'header');
    };
    /**
     * Selects the list item from the ListView by passing the elements or field object.
     * @param  {Fields | HTMLElement | Element} item - We can pass element Object or Fields as Object with ID and Text fields.
     */
    ListView.prototype.selectItem = function (item) {
        if (this.enableVirtualization) {
            this.virtualizationModule.selectItem(item);
        }
        else if (this.showCheckBox) {
            this.setCheckboxLI(this.getLiFromObjOrElement(item));
        }
        else {
            sf.base.isNullOrUndefined(item) ? this.removeSelect() : this.setSelectLI(this.getLiFromObjOrElement(item));
        }
    };
    ListView.prototype.getLiFromObjOrElement = function (obj) {
        var li;
        var dataSource = this.dataSource instanceof sf.data.DataManager ?
            this.localData : this.dataSource;
        if (!sf.base.isNullOrUndefined(obj)) {
            if (typeof dataSource[0] === 'string' || typeof dataSource[0] === 'number') {
                if (obj instanceof Element) {
                    var uid = obj.getAttribute('data-uid').toString();
                    for (var i = 0; i < this.liCollection.length; i++) {
                        if (this.liCollection[i].getAttribute('data-uid').toString() === uid) {
                            li = this.liCollection[i];
                            break;
                        }
                    }
                }
                else {
                    Array.prototype.some.call(this.curUL.querySelectorAll('.' + classNames.listItem), function (item) {
                        if (item.innerText.trim() === obj.toString()) {
                            li = item;
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                }
            }
            else {
                var resultJSON = this.getItemData(obj);
                var fieldData = sf.lists.getFieldValues(resultJSON, this.listBaseOption.fields);
                if (resultJSON) {
                    li = this.element.querySelector('[data-uid="'
                        + fieldData[this.fields.id] + '"]');
                    if (!this.enableVirtualization && sf.base.isNullOrUndefined(li)) {
                        var curLi = this.element.querySelectorAll('.' + classNames.listItem);
                        for (var i = 0; i < curLi.length; i++) {
                            if (curLi[i].innerText.trim() === fieldData[this.fields.text]) {
                                li = curLi[i];
                            }
                        }
                    }
                }
            }
        }
        return li;
    };
    /**
     * Selects multiple list items from the ListView.
     * @param  {Fields[] | HTMLElement[] | Element[]} item - We can pass array of
     *  elements or array of fields Object with ID and Text fields.
     */
    ListView.prototype.selectMultipleItems = function (item) {
        if (!sf.base.isNullOrUndefined(item)) {
            for (var i = 0; i < item.length; i++) {
                if (!sf.base.isNullOrUndefined(item[i])) {
                    this.selectItem(item[i]);
                }
            }
        }
    };
    ListView.prototype.getParentId = function () {
        var parentId = [];
        if (this.isNestedList) {
            for (var i = this.curDSLevel.length - 1; i >= 0; i--) {
                parentId.push(this.curDSLevel[i]);
            }
        }
        return parentId;
    };
    /**
     * Gets the details of the currently selected item from the list items.
     * @blazorType ListSelectedItem<TValue>
     */
    ListView.prototype.getSelectedItems = function () {
        // tslint:disable-next-line:no-any
        var finalValue;
        var isCompleted = false;
        this.selectedId = [];
        var dataSource = this.dataSource instanceof sf.data.DataManager ?
            this.localData : this.dataSource;
        if (this.enableVirtualization && !isCompleted) {
            finalValue = this.virtualizationModule.getSelectedItems();
            isCompleted = true;
        }
        else if (this.showCheckBox && !isCompleted) {
            // tslint:disable-next-line:no-any
            var liCollection = this.curUL.getElementsByClassName(classNames.selected);
            var liTextCollection = [];
            var liDataCollection = [];
            this.selectedId = [];
            var dataParent = [];
            for (var i = 0; i < liCollection.length; i++) {
                if (typeof dataSource[0] === 'string' || typeof dataSource[0] === 'number') {
                    liTextCollection.push(liCollection[i].innerText.trim());
                }
                else {
                    var tempData = this.getItemData(liCollection[i]);
                    var fieldData = sf.lists.getFieldValues(tempData, this.listBaseOption.fields);
                    if (this.isNestedList) {
                        dataParent.push({ data: tempData, parentId: this.getParentId() });
                    }
                    else {
                        liDataCollection.push(tempData);
                    }
                    if (fieldData) {
                        liTextCollection.push(fieldData[this.listBaseOption.fields.text]);
                        this.selectedId.push(fieldData[this.listBaseOption.fields.id]);
                    }
                    else {
                        liTextCollection.push(undefined);
                        this.selectedId.push(undefined);
                    }
                }
            }
            if ((typeof dataSource[0] === 'string'
                || typeof dataSource[0] === 'number')
                && !isCompleted) {
                finalValue = { item: liCollection, data: dataSource, text: liTextCollection };
                isCompleted = true;
            }
            if (this.isNestedList && !isCompleted) {
                finalValue = { item: liCollection, data: dataParent, text: liTextCollection };
                isCompleted = true;
            }
            else if (!isCompleted) {
                finalValue = { item: liCollection, data: liDataCollection, text: liTextCollection };
                isCompleted = true;
            }
        }
        else if (!isCompleted) {
            var liElement = this.element.getElementsByClassName(classNames.selected)[0];
            var fieldData = sf.lists.getFieldValues(this.getItemData(liElement), this.listBaseOption.fields);
            if ((typeof dataSource[0] === 'string'
                || typeof dataSource[0] === 'number')
                && !isCompleted) {
                finalValue = (!sf.base.isNullOrUndefined(liElement)) ? {
                    item: liElement, data: dataSource,
                    text: liElement.innerText.trim()
                } : undefined;
                isCompleted = true;
            }
            else if (!isCompleted) {
                if (sf.base.isNullOrUndefined(fieldData) || sf.base.isNullOrUndefined(liElement)) {
                    finalValue = undefined;
                    isCompleted = true;
                }
                else {
                    this.selectedId.push(fieldData[this.listBaseOption.fields.id]);
                    finalValue = {
                        text: fieldData[this.listBaseOption.fields.text], item: liElement,
                        data: this.getItemData(liElement)
                    };
                    isCompleted = true;
                }
            }
        }
        if (sf.base.isBlazor()) {
            // tslint:disable-next-line:no-any
            return this.blazorGetSelectedItems(finalValue);
        }
        else {
            return finalValue;
        }
    };
    // tslint:disable-next-line:no-any
    ListView.prototype.blazorGetSelectedItems = function (finalGetSelectedItem) {
        var blazorSelectedItem = {
            data: [],
            index: [],
            parentId: [],
            text: []
        };
        if (!sf.base.isNullOrUndefined(finalGetSelectedItem)) {
            if (!sf.base.isNullOrUndefined(finalGetSelectedItem.data)) {
                if (this.showCheckBox && this.isNestedList) {
                    for (var i = 0; i < finalGetSelectedItem.data.length; i++) {
                        blazorSelectedItem.data.push(finalGetSelectedItem.data[i].data);
                    }
                    if (!sf.base.isNullOrUndefined(finalGetSelectedItem.data[0])
                        && !sf.base.isNullOrUndefined(finalGetSelectedItem.data[0].parentId)) {
                        blazorSelectedItem.parentId = finalGetSelectedItem.data[0].parentId;
                    }
                }
                else {
                    blazorSelectedItem.data = this.convertItemsToArray(finalGetSelectedItem.data);
                }
            }
            if (!sf.base.isNullOrUndefined(finalGetSelectedItem.text)) {
                blazorSelectedItem.text = this.convertItemsToArray(finalGetSelectedItem.text);
            }
            if (!sf.base.isNullOrUndefined(finalGetSelectedItem.index)) {
                blazorSelectedItem.index = this.convertItemsToArray(finalGetSelectedItem.index);
            }
        }
        return blazorSelectedItem;
    };
    // tslint:disable-next-line:no-any
    ListView.prototype.convertItemsToArray = function (items) {
        return Array.isArray(items) ? items.slice() : [items];
    };
    /**
     * Finds out an item details from the current list.
     * @param  {Fields | HTMLElement | Element} item - We can pass element Object or Fields as Object with ID and Text fields.
     * @blazorType TValue
     */
    ListView.prototype.findItem = function (item) {
        return this.getItemData(item);
    };
    /**
     * Enables the disabled list items by passing the Id and text fields.
     * @param  {Fields | HTMLElement | Element} item - We can pass element Object or Fields as Object with ID and Text fields.
     */
    ListView.prototype.enableItem = function (item) {
        this.setItemState(item, true);
        if (this.enableVirtualization) {
            this.virtualizationModule.enableItem(item);
        }
    };
    /**
     * Disables the list items by passing the Id and text fields.
     * @param  {Fields | HTMLElement | Element} item - We can pass element Object or Fields as Object with ID and Text fields.
     */
    ListView.prototype.disableItem = function (item) {
        this.setItemState(item, false);
        if (this.enableVirtualization) {
            this.virtualizationModule.disableItem(item);
        }
    };
    //A function that used to set state of the list item like enable, disable.
    ListView.prototype.setItemState = function (item, isEnable) {
        var resultJSON = this.getItemData(item);
        var fieldData = sf.lists.getFieldValues(resultJSON, this.listBaseOption.fields);
        if (resultJSON) {
            var li = this.element.querySelector('[data-uid="' + fieldData[this.fields.id] + '"]');
            if (isEnable) {
                if (li) {
                    li.classList.remove(classNames.disable);
                }
                delete resultJSON[this.fields.enabled];
            }
            else if (!isEnable) {
                if (li) {
                    li.classList.add(classNames.disable);
                }
                resultJSON[this.fields.enabled] = false;
            }
        }
    };
    /**
     * Shows the hide list item from the ListView.
     * @param  {Fields | HTMLElement | Element} item - We can pass element Object or Fields as Object with ID and Text fields.
     */
    ListView.prototype.showItem = function (item) {
        this.showHideItem(item, false, '');
        if (this.enableVirtualization) {
            this.virtualizationModule.showItem(item);
        }
    };
    /**
     * Hides an list item from the ListView.
     * @param  {Fields | HTMLElement | Element} item - We can pass element Object or Fields as Object with ID and Text fields.
     */
    ListView.prototype.hideItem = function (item) {
        this.showHideItem(item, true, 'none');
        if (this.enableVirtualization) {
            this.virtualizationModule.hideItem(item);
        }
    };
    ListView.prototype.showHideItem = function (obj, isHide, display) {
        var resultJSON = this.getItemData(obj);
        var fieldData = sf.lists.getFieldValues(resultJSON, this.listBaseOption.fields);
        if (resultJSON) {
            var li = this.element.querySelector('[data-uid="' + fieldData[this.fields.id] + '"]');
            if (li) {
                li.style.display = display;
            }
            if (isHide) {
                resultJSON[this.fields.isVisible] = false;
            }
            else {
                delete resultJSON[this.fields.isVisible];
            }
        }
    };
    /**
     * Adds the new list item(s) to the current ListView.
     * To add a new list item(s) in the ListView, we need to pass the `data` as an array of items that need
     * to be added and `fields` as the target item to which we need to add the given item(s) as its children.
     * For example fields: { text: 'Name', tooltip: 'Name', id:'id'}
     * @param  {{[key:string]:Object}[]} data - JSON Array Data that need to add.
     * @param  {Fields} fields - Target item to add the given data as its children (can be null).
     * @blazorArgsType data|object,fields|object
     */
    ListView.prototype.addItem = function (data, fields) {
        if (fields === void 0) { fields = undefined; }
        var dataSource = this.dataSource instanceof sf.data.DataManager
            ? this.localData : this.dataSource;
        this.addItemInternally(data, fields, dataSource);
    };
    ListView.prototype.addItemInternally = function (data, fields, dataSource) {
        if (data instanceof Array) {
            if (this.enableVirtualization) {
                this.virtualizationModule.addItem(data, fields, dataSource);
            }
            else {
                var ds = this.findItemFromDS(dataSource, fields);
                var child = void 0;
                if (ds) {
                    var fieldData = sf.lists.getFieldValues(ds, this.listBaseOption.fields);
                    child = fieldData[this.fields.child];
                    if (!child) {
                        child = [];
                    }
                    child = child.concat(data);
                }
                // check for whether target is nested level or top level in list
                if (ds instanceof Array) {
                    for (var i = 0; i < data.length; i++) {
                        dataSource.push(data[i]);
                        this.setViewDataSource(dataSource);
                        // since it is top level target, get the content container's first child
                        // as it is always the top level UL
                        var targetUL = this.contentContainer
                            ? this.contentContainer.children[0]
                            : null;
                        // check for whether the list was previously empty or not, if it is
                        // proceed to call initial render
                        if (this.contentContainer && targetUL) {
                            this.addItemIntoDom(data[i], targetUL, this.curViewDS);
                        }
                        else {
                            this.reRender();
                        }
                    }
                    if (this.curUL) {
                        this.updateBlazorTemplates(true);
                    }
                    this.liCollection = this.curUL.querySelectorAll('.' + classNames.listItem);
                }
                else {
                    // proceed as target item is in nested level, only if it is a valid target ds
                    if (ds) {
                        ds[this.fields.child] = child;
                        this.addItemInNestedList(ds, data);
                    }
                }
            }
        }
    };
    ListView.prototype.addItemInNestedList = function (targetItemData, itemQueue) {
        var targetItemId = targetItemData[this.fields.id];
        var targetChildDS = targetItemData[this.fields.child];
        var isAlreadyRenderedUL = this.element.querySelector('[pid=\'' + targetItemId + '\']');
        var targetLi = this.element.querySelector('[data-uid=\'' + targetItemId + '\']');
        var targetUL = isAlreadyRenderedUL
            ? isAlreadyRenderedUL
            : targetLi
                ? sf.base.closest(targetLi, 'ul')
                : null;
        var targetDS = isAlreadyRenderedUL ? targetChildDS : [targetItemData];
        var isTargetEmptyChild = targetLi ? !targetLi.classList.contains(classNames.hasChild) : false;
        var isRefreshTemplateNeeded = false;
        // if li element is already rendered, that element needs to be refreshed so that
        // it becomes child viewable due to new child items are added now
        if (isTargetEmptyChild) {
            var targetRefreshedElement = sf.lists.ListBase.createListItemFromJson(this.createElement, targetDS, this.listBaseOption, null, null, this);
            this.setAttributes(targetRefreshedElement);
            targetUL.insertBefore(targetRefreshedElement[0], targetLi);
            sf.base.detach(targetLi);
            isRefreshTemplateNeeded = true;
        }
        // if it is already rendered element, we need to create and append new elements
        if (isAlreadyRenderedUL && itemQueue) {
            for (var i = 0; i < itemQueue.length; i++) {
                targetDS.push(itemQueue[i]);
                this.addItemIntoDom(itemQueue[i], targetUL, targetDS);
            }
            isRefreshTemplateNeeded = true;
        }
        if (isRefreshTemplateNeeded) {
            this.updateBlazorTemplates(true);
        }
    };
    ListView.prototype.addItemIntoDom = function (currentItem, targetUL, curViewDS) {
        var index = curViewDS.indexOf(currentItem);
        this.addListItem(currentItem, index, targetUL, curViewDS);
        var curItemDS = curViewDS[index - 1];
        if (curItemDS && curItemDS.isHeader && curItemDS.items.length === 1) {
            this.addListItem(curItemDS, (index - 1), targetUL, curViewDS);
        }
    };
    ListView.prototype.addListItem = function (dataSource, index, ulElement, curViewDS) {
        var target = this.getLiFromObjOrElement(curViewDS[index + 1]) ||
            this.getLiFromObjOrElement(curViewDS[index + 2]) || null;
        var li = sf.lists.ListBase.createListItemFromJson(this.createElement, [dataSource], this.listBaseOption, null, null, this);
        this.setAttributes(li);
        // tslint:disable-next-line
        if (this.template && this.isReact) {
            this.renderReactTemplates();
        }
        ulElement.insertBefore(li[0], target);
    };
    /**
     * Removes the list item from the data source based on a passed
     *  element like fields: { text: 'Name', tooltip: 'Name', id:'id'}
     * @param  {Fields | HTMLElement | Element} item - We can pass element Object or Fields as Object with ID and Text fields.
     */
    ListView.prototype.removeItem = function (item) {
        var listDataSource = this.dataSource instanceof sf.data.DataManager
            ? this.localData : this.dataSource;
        if (this.enableVirtualization) {
            this.virtualizationModule.removeItem(item);
        }
        else {
            this.removeItemFromList(item, listDataSource);
            this.updateBlazorTemplates(true);
        }
    };
    ListView.prototype.removeItemFromList = function (obj, listDataSource) {
        var _this = this;
        var curViewDS = this.curViewDS;
        var fields = obj instanceof Element ? this.getElementUID(obj) : obj;
        var dataSource;
        dataSource = this.findItemFromDS(listDataSource, fields, true);
        if (dataSource) {
            var data_1;
            data_1 = this.findItemFromDS(dataSource, fields);
            var index = curViewDS.indexOf(data_1);
            var li = this.getLiFromObjOrElement(obj);
            var groupLi = void 0;
            this.validateNestedView(li);
            if (this.fields.groupBy && this.curViewDS[index - 1] &&
                curViewDS[index - 1].isHeader &&
                curViewDS[index - 1].items.length === 1) {
                if (li && li.previousElementSibling.classList.contains(classNames.groupListItem) &&
                    (sf.base.isNullOrUndefined(li.nextElementSibling) || (li.nextElementSibling &&
                        li.nextElementSibling.classList.contains(classNames.groupListItem)))) {
                    groupLi = li.previousElementSibling;
                }
            }
            if (li) {
                sf.base.detach(li);
            }
            if (groupLi) {
                sf.base.detach(groupLi);
            }
            // tslint:disable-next-line:no-any
            var foundData = (dataSource.length - 1) <= 0
                ? this.findParent(this.localData, this.fields.id, function (value) { return value === data_1[_this.fields.id]; }, null) : null;
            var dsIndex = dataSource.indexOf(data_1);
            dataSource.splice(dsIndex, 1);
            this.setViewDataSource(listDataSource);
            if (foundData
                && foundData.parent
                && Array.isArray(foundData.parent[this.fields.child])
                && foundData.parent[this.fields.child].length <= 0) {
                var parentLi = this.getLiFromObjOrElement(foundData.parent);
                if (parentLi) {
                    var li_1 = sf.lists.ListBase.createListItemFromJson(this.createElement, [foundData.parent], this.listBaseOption, null, null, this);
                    this.setAttributes(li_1);
                    parentLi.parentElement.insertBefore(li_1[0], parentLi);
                    parentLi.parentElement.removeChild(parentLi);
                }
            }
            if (dataSource.length <= 0) {
                this.back();
            }
            this.liCollection = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.listItem));
        }
    };
    // validate before removing an element whether the current view is inside target element's child view
    ListView.prototype.validateNestedView = function (li) {
        var liID = li ? li.getAttribute('data-uid').toString().toLowerCase() : null;
        if (liID && this.curDSLevel && this.curDSLevel.length > 0) {
            while (this.curDSLevel.some(function (id) { return id.toString().toLowerCase() === liID; })) {
                this.back();
            }
        }
    };
    /**
     * Removes multiple items from the ListView by passing the array of elements or array of field objects.
     * @param  {Fields[] | HTMLElement[] | Element[]} item - We can pass array of elements or array of field Object with ID and Text fields.
     */
    ListView.prototype.removeMultipleItems = function (item) {
        if (item.length) {
            for (var i = 0; i < item.length; i++) {
                this.removeItem(item[i]);
            }
            this.updateBlazorTemplates(true);
        }
    };
    // tslint:disable-next-line:no-any
    ListView.prototype.findParent = function (dataSource, id, callback, parent) {
        if (dataSource.hasOwnProperty(id) && callback(dataSource[id]) === true) {
            return sf.base.extend({}, dataSource);
        }
        for (var i = 0; i < Object.keys(dataSource).length; i++) {
            if (dataSource[Object.keys(dataSource)[i]]
                && typeof dataSource[Object.keys(dataSource)[i]] === 'object') {
                // tslint:disable-next-line:no-any
                var result = this.findParent(dataSource[Object.keys(dataSource)[i]], id, callback, dataSource);
                if (result != null) {
                    if (!result.parent) {
                        result.parent = parent;
                    }
                    return result;
                }
            }
        }
        return null;
    };
    // Module Required function
    ListView.prototype.getModuleName = function () {
        return 'listview';
    };
    ListView.prototype.requiredModules = function () {
        var modules = [];
        if (this.enableVirtualization) {
            modules.push({ args: [this], member: 'virtualization' });
        }
        return modules;
    };
    /**
     * Get the properties to be maintained in the persisted state.
     */
    ListView.prototype.getPersistData = function () {
        return this.addOnPersist(['cssClass', 'enableRtl', 'htmlAttributes',
            'enable', 'fields', 'animation', 'headerTitle',
            'sortOrder', 'showIcon', 'height', 'width', 'showCheckBox', 'checkBoxPosition']);
    };
    __decorate([
        sf.base.Property('')
    ], ListView.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(false)
    ], ListView.prototype, "enableVirtualization", void 0);
    __decorate([
        sf.base.Property({})
    ], ListView.prototype, "htmlAttributes", void 0);
    __decorate([
        sf.base.Property(true)
    ], ListView.prototype, "enable", void 0);
    __decorate([
        sf.base.Property([])
    ], ListView.prototype, "dataSource", void 0);
    __decorate([
        sf.base.Property()
    ], ListView.prototype, "query", void 0);
    __decorate([
        sf.base.Complex(sf.lists.ListBase.defaultMappedFields, FieldSettings)
    ], ListView.prototype, "fields", void 0);
    __decorate([
        sf.base.Property({ effect: 'SlideLeft', duration: 400, easing: 'ease' })
    ], ListView.prototype, "animation", void 0);
    __decorate([
        sf.base.Property('None')
    ], ListView.prototype, "sortOrder", void 0);
    __decorate([
        sf.base.Property(false)
    ], ListView.prototype, "showIcon", void 0);
    __decorate([
        sf.base.Property(false)
    ], ListView.prototype, "showCheckBox", void 0);
    __decorate([
        sf.base.Property('Left')
    ], ListView.prototype, "checkBoxPosition", void 0);
    __decorate([
        sf.base.Property('')
    ], ListView.prototype, "headerTitle", void 0);
    __decorate([
        sf.base.Property(false)
    ], ListView.prototype, "showHeader", void 0);
    __decorate([
        sf.base.Property(false)
    ], ListView.prototype, "enableHtmlSanitizer", void 0);
    __decorate([
        sf.base.Property('')
    ], ListView.prototype, "height", void 0);
    __decorate([
        sf.base.Property('')
    ], ListView.prototype, "width", void 0);
    __decorate([
        sf.base.Property(null)
    ], ListView.prototype, "template", void 0);
    __decorate([
        sf.base.Property(null)
    ], ListView.prototype, "headerTemplate", void 0);
    __decorate([
        sf.base.Property(null)
    ], ListView.prototype, "groupTemplate", void 0);
    __decorate([
        sf.base.Event()
    ], ListView.prototype, "select", void 0);
    __decorate([
        sf.base.Event()
    ], ListView.prototype, "actionBegin", void 0);
    __decorate([
        sf.base.Event()
    ], ListView.prototype, "actionComplete", void 0);
    __decorate([
        sf.base.Event()
    ], ListView.prototype, "actionFailure", void 0);
    ListView = __decorate([
        sf.base.NotifyPropertyChanges
    ], ListView);
    return ListView;
}(sf.base.Component));

var listElementCount = 1.5;
var windowElementCount = 3;
var Virtualization = /** @class */ (function () {
    function Virtualization(instance) {
        this.elementDifference = 0;
        this.listViewInstance = instance;
    }
    /**
     * For internal use only.
     * @private
     */
    Virtualization.prototype.isNgTemplate = function () {
        return !sf.base.isNullOrUndefined(this.listViewInstance.templateRef) && typeof this.listViewInstance.templateRef !== 'string';
    };
    /**
     * For internal use only.
     * @private
     */
    Virtualization.prototype.uiVirtualization = function () {
        this.wireScrollEvent(false);
        var curViewDS = this.listViewInstance.curViewDS;
        var firstDs = curViewDS.slice(0, 1);
        if (!(sf.base.isBlazor() || this.listViewInstance.isServerRendered)) {
            this.listViewInstance.ulElement = this.listViewInstance.curUL = sf.lists.ListBase.createList(this.listViewInstance.createElement, firstDs, this.listViewInstance.listBaseOption, null, this);
            this.listViewInstance.contentContainer = this.listViewInstance.createElement('div', { className: classNames.content });
            this.listViewInstance.element.appendChild(this.listViewInstance.contentContainer);
            this.listViewInstance.contentContainer.appendChild(this.listViewInstance.ulElement);
        }
        this.listItemHeight = this.listViewInstance.ulElement.firstElementChild.getBoundingClientRect().height;
        this.expectedDomItemCount = this.ValidateItemCount(10000);
        this.domItemCount = this.ValidateItemCount(Object.keys(this.listViewInstance.curViewDS).length);
        this.uiFirstIndex = 0;
        this.uiLastIndex = this.domItemCount - 1;
        var otherDs = curViewDS.slice(1, this.domItemCount);
        if (!(sf.base.isBlazor() || this.listViewInstance.isServerRendered)) {
            var listItems = sf.lists.ListBase.createListItemFromJson(this.listViewInstance.createElement, otherDs, this.listViewInstance.listBaseOption, null, null, this);
            sf.base.append(listItems, this.listViewInstance.ulElement);
            this.listViewInstance.liCollection = this.listViewInstance.curUL.querySelectorAll('li');
            this.topElement = this.listViewInstance.createElement('div');
            this.listViewInstance.ulElement.insertBefore(this.topElement, this.listViewInstance.ulElement.firstElementChild);
            this.bottomElement = this.listViewInstance.createElement('div');
            this.listViewInstance.ulElement.insertBefore(this.bottomElement, null);
            this.totalHeight = (Object.keys(curViewDS).length * this.listItemHeight) - (this.domItemCount * this.listItemHeight);
            this.topElement.style.height = 0 + 'px';
            this.bottomElement.style.height = this.totalHeight + 'px';
            this.topElementHeight = 0;
            this.bottomElementHeight = this.totalHeight;
        }
        else {
            this.listViewInstance.contentContainer = this.listViewInstance.element.querySelector('.e-content');
            this.listViewInstance.liCollection = this.listViewInstance.curUL.querySelectorAll('li');
        }
        this.listDiff = 0;
        this.uiIndicesInitialization();
    };
    Virtualization.prototype.wireScrollEvent = function (destroy) {
        if (!destroy) {
            if (!(sf.base.isBlazor() && this.listViewInstance.isServerRendered)) {
                if (this.listViewInstance.isWindow) {
                    this.onVirtualScroll = this.onVirtualUiScroll.bind(this);
                    window.addEventListener('scroll', this.onVirtualScroll);
                }
                else {
                    sf.base.EventHandler.add(this.listViewInstance.element, 'scroll', this.onVirtualUiScroll, this);
                }
            }
            else {
                if (this.listViewInstance.isWindow) {
                    // tslint:disable-next-line:no-any
                    this.onVirtualScroll = sf.base.debounce(this.onVirtualUiScroll.bind(this), 350);
                    // tslint:enable-next-line:no-any      
                    this.updateUl = this.updateUlContainer.bind(this);
                    window.addEventListener('scroll', this.onVirtualScroll);
                    window.addEventListener('scroll', this.updateUl);
                }
                else {
                    sf.base.EventHandler.add(this.listViewInstance.element, 'scroll', sf.base.debounce(this.onVirtualUiScroll, 350), this);
                    sf.base.EventHandler.add(this.listViewInstance.element, 'scroll', this.updateUlContainer, this);
                }
            }
        }
        else {
            this.listViewInstance.isWindow ? window.removeEventListener('scroll', this.onVirtualScroll) :
                sf.base.EventHandler.remove(this.listViewInstance.element, 'scroll', this.onVirtualUiScroll);
            this.listViewInstance.isWindow ? window.removeEventListener('scroll', this.updateUl) :
                sf.base.EventHandler.remove(this.listViewInstance.element, 'scroll', this.updateUlContainer);
        }
    };
    Virtualization.prototype.updateUlContainer = function (e) {
        var listDiff;
        var virtualElementContainer = this.listViewInstance.ulElement.querySelector('.' + classNames.virtualElementContainer);
        if (sf.base.isNullOrUndefined(this.listViewInstance.liElementHeight)) {
            this.listViewInstance.updateLiElementHeight();
        }
        if (this.listViewInstance.isWindow) {
            // tslint:disable-next-line:no-any
            listDiff = Math.round(e.target.documentElement.scrollTop / this.listViewInstance.liElementHeight) - 2;
            // tslint:enable-next-line:no-any  
        }
        else {
            // tslint:disable-next-line:no-any
            listDiff = Math.round(e.target.scrollTop / this.listViewInstance.liElementHeight) - 2;
            // tslint:enable-next-line:no-any  
        }
        if (((listDiff - 1) * this.listViewInstance.liElementHeight) < 0) {
            virtualElementContainer.style.top = '0px';
        }
        else {
            virtualElementContainer.style.top = (listDiff) * this.listViewInstance.liElementHeight + 'px';
        }
    };
    Virtualization.prototype.ValidateItemCount = function (dataSourceLength) {
        var height = parseFloat(sf.base.formatUnit(this.listViewInstance.height));
        var itemCount;
        if (this.listViewInstance.isWindow) {
            itemCount = Math.round((window.innerHeight / this.listItemHeight) * windowElementCount);
        }
        else {
            if (typeof this.listViewInstance.height === 'string' && this.listViewInstance.height.indexOf('%') !== -1) {
                // tslint:disable-next-line:max-line-length
                itemCount = Math.round((this.listViewInstance.element.getBoundingClientRect().height / this.listItemHeight) * listElementCount);
            }
            else {
                itemCount = Math.round((height / this.listItemHeight) * listElementCount);
            }
        }
        if (itemCount > dataSourceLength) {
            itemCount = dataSourceLength;
        }
        return itemCount;
    };
    Virtualization.prototype.uiIndicesInitialization = function () {
        this.uiIndices = { 'activeIndices': [], 'disabledItemIndices': [], 'hiddenItemIndices': [] };
        var data = this.listViewInstance.curViewDS;
        for (var i = 0; i < data.length; i++) {
            if (this.listViewInstance.showCheckBox && data[i][this.listViewInstance.fields.isChecked]) {
                this.uiIndices.activeIndices.push(i);
            }
            if (!sf.base.isNullOrUndefined(data[i][this.listViewInstance.fields.enabled]) && !data[i][this.listViewInstance.fields.enabled]) {
                this.uiIndices.disabledItemIndices.push(i);
            }
        }
        if (this.isNgTemplate()) {
            var items = this.listViewInstance.element.querySelectorAll('.' + classNames.listItem);
            for (var index = 0; index < items.length; index++) {
                items[index].context = this.listViewInstance.viewContainerRef.get(index).context;
            }
        }
    };
    Virtualization.prototype.refreshItemHeight = function () {
        if (this.listViewInstance.curViewDS.length) {
            var curViewDS = this.listViewInstance.curViewDS;
            if (sf.base.isBlazor() && this.listViewInstance.isServerRendered) {
                this.listViewInstance.ulElement.children[0].style.height =
                    (this.listViewInstance.liElementHeight * (Object.keys(curViewDS).length)) + 'px';
            }
            else {
                this.listItemHeight = this.topElement.nextSibling.getBoundingClientRect().height;
                this.totalHeight = (Object.keys(curViewDS).length * this.listItemHeight) - (this.domItemCount * this.listItemHeight);
                this.bottomElementHeight = this.totalHeight;
                this.bottomElement.style.height = this.totalHeight + 'px';
            }
        }
    };
    Virtualization.prototype.getscrollerHeight = function (startingHeight) {
        return this.listViewInstance.isWindow ? (((pageYOffset - startingHeight) <= 0) ? 0 :
            (pageYOffset - startingHeight)) : ((this.listViewInstance.element.scrollTop - startingHeight) <= 0) ? 0 :
            (this.listViewInstance.element.scrollTop - startingHeight);
    };
    Virtualization.prototype.onVirtualUiScroll = function (e) {
        var _a;
        var startingHeight;
        if (this.listViewInstance.isWindow) {
            startingHeight = this.listViewInstance.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
        }
        else {
            startingHeight = this.listViewInstance.headerEle ? this.listViewInstance.headerEle.getBoundingClientRect().height : 0;
        }
        this.scrollPosition = sf.base.isNullOrUndefined(this.scrollPosition) ? 0 : this.scrollPosition;
        var scroll = this.getscrollerHeight(startingHeight);
        this.topElementHeight = this.listItemHeight * Math.floor(scroll / this.listItemHeight);
        this.bottomElementHeight = this.totalHeight - this.topElementHeight;
        _a = scroll <= this.totalHeight ?
            [this.topElementHeight, this.bottomElementHeight] : [this.totalHeight, 0], this.topElementHeight = _a[0], this.bottomElementHeight = _a[1];
        if (sf.base.isBlazor() && this.listViewInstance.isServerRendered) {
            var listDiff = void 0;
            if (sf.base.isNullOrUndefined(this.listViewInstance.liElementHeight)) {
                this.listViewInstance.updateLiElementHeight();
            }
            if (this.listViewInstance.isWindow) {
                listDiff = Math.round(document.documentElement.scrollTop / this.listViewInstance.liElementHeight);
            }
            else {
                // tslint:disable-next-line:no-any
                listDiff = Math.round(e.target.scrollTop / this.listViewInstance.liElementHeight);
                // tslint:enable-next-line:no-any
            }
            if ((listDiff - 2) - this.elementDifference >= 3 || (listDiff - 2) - this.elementDifference <= -1) {
                var args = { listDiff: listDiff - 2, selectedItems: this.listViewInstance.previousSelectedItems };
                this.listViewInstance.interopAdaptor.invokeMethodAsync('VirtalScrolling', args);
                if (this.listViewInstance.ulElement.querySelector('.e-focused')) {
                    this.listViewInstance.ulElement.querySelector('.e-focused').classList.remove('e-focused');
                }
                this.elementDifference = listDiff - 2;
            }
        }
        else {
            if (this.topElementHeight !== parseFloat(this.topElement.style.height)) {
                this.topElement.style.height = this.topElementHeight + 'px';
                this.bottomElement.style.height = this.bottomElementHeight + 'px';
                if (scroll > this.scrollPosition) {
                    var listDiff = Math.round(((this.topElementHeight / this.listItemHeight) - this.listDiff));
                    if (listDiff > (this.expectedDomItemCount + 5)) {
                        this.onLongScroll(listDiff, true);
                    }
                    else {
                        this.onNormalScroll(listDiff, true);
                    }
                }
                else {
                    var listDiff = Math.round((this.listDiff - (this.topElementHeight / this.listItemHeight)));
                    if (listDiff > (this.expectedDomItemCount + 5)) {
                        this.onLongScroll(listDiff, false);
                    }
                    else {
                        this.onNormalScroll(listDiff, false);
                    }
                }
            }
            this.listDiff = Math.round(this.topElementHeight / this.listItemHeight);
            if (typeof this.listViewInstance.onUIScrolled === 'function') {
                this.listViewInstance.onUIScrolled();
            }
        }
        this.scrollPosition = scroll;
    };
    Virtualization.prototype.onLongScroll = function (listDiff, isScrollingDown) {
        var index = isScrollingDown ? (this.uiFirstIndex + listDiff) : (this.uiFirstIndex - listDiff);
        var elements = this.listViewInstance.ulElement.querySelectorAll('li');
        for (var i = 0; i < elements.length; i++) {
            this.updateUI(elements[i], index);
            index++;
        }
        this.uiLastIndex = isScrollingDown ? (this.uiLastIndex + listDiff) : (this.uiLastIndex - listDiff);
        this.uiFirstIndex = isScrollingDown ? (this.uiFirstIndex + listDiff) : (this.uiFirstIndex - listDiff);
    };
    Virtualization.prototype.onNormalScroll = function (listDiff, isScrollingDown) {
        if (isScrollingDown) {
            for (var i = 0; i < listDiff; i++) {
                var index = ++this.uiLastIndex;
                this.updateUI(this.topElement.nextElementSibling, index, this.bottomElement);
                this.uiFirstIndex++;
            }
        }
        else {
            for (var i = 0; i < listDiff; i++) {
                var index = --this.uiFirstIndex;
                var target = this.topElement.nextSibling;
                this.updateUI(this.bottomElement.previousElementSibling, index, target);
                this.uiLastIndex--;
            }
        }
    };
    Virtualization.prototype.updateUiContent = function (element, index) {
        var curViewDs = this.listViewInstance.curViewDS;
        if (typeof this.listViewInstance.dataSource[0] === 'string' ||
            typeof this.listViewInstance.dataSource[0] === 'number') {
            element.dataset.uid = sf.lists.ListBase.generateId();
            element.getElementsByClassName(classNames.listItemText)[0].innerHTML =
                this.listViewInstance.curViewDS[index].toString();
        }
        else {
            element.dataset.uid = curViewDs[index][this.listViewInstance.fields.id] ?
                curViewDs[index][this.listViewInstance.fields.id].toString() : sf.lists.ListBase.generateId();
            element.getElementsByClassName(classNames.listItemText)[0].innerHTML =
                curViewDs[index][this.listViewInstance.fields.text].toString();
        }
        if (this.listViewInstance.showIcon) {
            if (element.querySelector('.' + classNames.listIcon)) {
                sf.base.detach(element.querySelector('.' + classNames.listIcon));
            }
            if (this.listViewInstance.curViewDS[index][this.listViewInstance.fields.iconCss]) {
                var textContent = element.querySelector('.' + classNames.textContent);
                var target = this.listViewInstance.createElement('div', {
                    className: classNames.listIcon + ' ' +
                        this.listViewInstance.curViewDS[index][this.listViewInstance.fields.iconCss]
                });
                textContent.insertBefore(target, element.querySelector('.' + classNames.listItemText));
            }
        }
        if (this.listViewInstance.showCheckBox && this.listViewInstance.fields.groupBy) {
            if (!this.checkListWrapper) {
                this.checkListWrapper = this.listViewInstance.curUL.querySelector('.' + classNames.checkboxWrapper).cloneNode(true);
            }
            var textContent = element.querySelector('.' + classNames.textContent);
            if (this.listViewInstance.curViewDS[index].isHeader) {
                if (element.querySelector('.' + classNames.checkboxWrapper)) {
                    element.classList.remove(classNames.checklist);
                    textContent.classList.remove(classNames.checkbox);
                    sf.base.detach(element.querySelector('.' + classNames.checkboxWrapper));
                }
            }
            else {
                if (!element.querySelector('.' + classNames.checkboxWrapper)) {
                    element.classList.add(classNames.checklist);
                    textContent.classList.add(classNames.checkbox);
                    textContent.insertBefore(this.checkListWrapper.cloneNode(true), element.querySelector('.' + classNames.listItemText));
                }
            }
        }
    };
    Virtualization.prototype.changeElementAttributes = function (element, index) {
        element.classList.remove(classNames.disable);
        if (this.uiIndices.disabledItemIndices.length && this.uiIndices.disabledItemIndices.indexOf(index) !== -1) {
            element.classList.add(classNames.disable);
        }
        element.style.display = '';
        if (this.uiIndices.hiddenItemIndices.length && this.uiIndices.hiddenItemIndices.indexOf(index) !== -1) {
            element.style.display = 'none';
        }
        if (this.listViewInstance.showCheckBox) {
            var checklistElement = element.querySelector('.' + classNames.checkboxWrapper);
            element.classList.remove(classNames.selected);
            element.classList.remove(classNames.focused);
            if (checklistElement) {
                checklistElement.removeAttribute('aria-checked');
                checklistElement.firstElementChild.classList.remove(classNames.checked);
            }
            if (this.uiIndices.activeIndices.length && this.uiIndices.activeIndices.indexOf(index) !== -1 &&
                !this.listViewInstance.curUL.querySelector(classNames.selected)) {
                element.classList.add(classNames.selected);
                checklistElement.firstElementChild.classList.add(classNames.checked);
                checklistElement.setAttribute('aria-checked', 'true');
                if (this.activeIndex === index) {
                    element.classList.add(classNames.focused);
                }
            }
        }
        else {
            element.classList.remove(classNames.selected);
            element.removeAttribute('aria-selected');
            if (!sf.base.isNullOrUndefined(this.activeIndex) && this.activeIndex === index &&
                !this.listViewInstance.curUL.querySelector(classNames.selected)) {
                element.classList.add(classNames.selected);
                element.setAttribute('aria-selected', 'true');
            }
        }
        if (this.listViewInstance.fields.groupBy) {
            if (this.listViewInstance.curViewDS[index].isHeader) {
                if (element.classList.contains(classNames.listItem)) {
                    element.classList.remove(classNames.listItem);
                    element.setAttribute('role', 'group');
                    element.classList.add(classNames.groupListItem);
                }
            }
            else {
                if (element.classList.contains(classNames.groupListItem)) {
                    element.classList.remove(classNames.groupListItem);
                    element.setAttribute('role', 'listitem');
                    element.classList.add(classNames.listItem);
                }
            }
        }
    };
    Virtualization.prototype.findDSAndIndexFromId = function (ds, fields) {
        var _this = this;
        var resultJSON = {};
        fields = this.listViewInstance.getElementUID(fields);
        if (!sf.base.isNullOrUndefined(fields)) {
            ds.some(function (data, index) {
                if ((fields[_this.listViewInstance.fields.id] &&
                    fields[_this.listViewInstance.fields.id].toString()
                        === (data[_this.listViewInstance.fields.id] && data[_this.listViewInstance.fields.id].toString())) || fields === data) {
                    resultJSON.index = index;
                    resultJSON.data = data;
                    return true;
                }
                else {
                    return false;
                }
            });
        }
        return resultJSON;
    };
    Virtualization.prototype.getSelectedItems = function () {
        var _this = this;
        if (!sf.base.isNullOrUndefined(this.activeIndex) || (this.listViewInstance.showCheckBox && this.uiIndices.activeIndices.length)) {
            var dataCollection = [];
            var textCollection = [];
            if (typeof this.listViewInstance.dataSource[0] === 'string' ||
                typeof this.listViewInstance.dataSource[0] === 'number') {
                var curViewDS_1 = this.listViewInstance.curViewDS;
                if (this.listViewInstance.showCheckBox) {
                    var indices = this.uiIndices.activeIndices;
                    for (var i = 0; i < indices.length; i++) {
                        dataCollection.push(curViewDS_1[indices[i]]);
                    }
                    return {
                        text: dataCollection,
                        data: dataCollection,
                        index: this.uiIndices.activeIndices.map(function (index) {
                            return _this.listViewInstance.dataSource.indexOf(curViewDS_1[index]);
                        })
                    };
                }
                else {
                    return {
                        text: curViewDS_1[this.activeIndex],
                        data: curViewDS_1[this.activeIndex],
                        index: this.listViewInstance.dataSource.indexOf(curViewDS_1[this.activeIndex])
                    };
                }
            }
            else {
                if (sf.base.isBlazor() && this.listViewInstance.isServerRendered) {
                    var scrollDiff = Math.round(this.listViewInstance.element.scrollTop /
                        this.listViewInstance.liElementHeight) - 2;
                    if (scrollDiff < 0) {
                        scrollDiff = 0;
                    }
                    this.activeIndex += scrollDiff;
                }
                var curViewDS_2 = this.listViewInstance.curViewDS;
                var text = this.listViewInstance.fields.text;
                if (this.listViewInstance.showCheckBox) {
                    var indexArray = this.uiIndices.activeIndices;
                    for (var i = 0; i < indexArray.length; i++) {
                        textCollection.push(curViewDS_2[indexArray[i]][text]);
                        dataCollection.push(curViewDS_2[indexArray[i]]);
                    }
                    var dataSource_1 = this.listViewInstance.dataSource instanceof sf.data.DataManager
                        ? curViewDS_2 : this.listViewInstance.dataSource;
                    return {
                        text: textCollection,
                        data: dataCollection,
                        index: this.uiIndices.activeIndices.map(function (index) {
                            return dataSource_1.indexOf(curViewDS_2[index]);
                        })
                    };
                }
                else {
                    var dataSource = this.listViewInstance.dataSource instanceof sf.data.DataManager
                        ? curViewDS_2 : this.listViewInstance.dataSource;
                    return {
                        text: curViewDS_2[this.activeIndex][this.listViewInstance.fields.text],
                        data: curViewDS_2[this.activeIndex],
                        index: dataSource.indexOf(curViewDS_2[this.activeIndex])
                    };
                }
            }
        }
        else {
            return undefined;
        }
    };
    Virtualization.prototype.selectItem = function (obj) {
        var resutJSON = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            var isSelected = this.activeIndex === resutJSON.index;
            var isChecked = void 0;
            this.activeIndex = resutJSON.index;
            if (this.listViewInstance.showCheckBox) {
                if (this.uiIndices.activeIndices.indexOf(resutJSON.index) === -1) {
                    isChecked = true;
                    this.uiIndices.activeIndices.push(resutJSON.index);
                }
                else {
                    isChecked = false;
                    this.uiIndices.activeIndices.splice(this.uiIndices.activeIndices.indexOf(resutJSON.index), 1);
                }
                if (this.listViewInstance.curUL.querySelector('.' + classNames.focused)) {
                    this.listViewInstance.curUL.querySelector('.' + classNames.focused).classList.remove(classNames.focused);
                }
            }
            if (this.listViewInstance.getLiFromObjOrElement(obj)) {
                if (this.listViewInstance.showCheckBox) {
                    this.listViewInstance.setCheckboxLI(this.listViewInstance.getLiFromObjOrElement(obj));
                }
                else {
                    this.listViewInstance.setSelectLI(this.listViewInstance.getLiFromObjOrElement(obj));
                }
            }
            else {
                var eventArgs = void 0;
                if (typeof this.listViewInstance.dataSource[0] === 'string' ||
                    typeof this.listViewInstance.dataSource[0] === 'number') {
                    eventArgs = {
                        text: this.listViewInstance.curViewDS[this.activeIndex],
                        data: this.listViewInstance.curViewDS[this.activeIndex],
                        index: this.activeIndex
                    };
                }
                else {
                    var curViewDS = this.listViewInstance.curViewDS;
                    eventArgs = {
                        text: curViewDS[this.activeIndex][this.listViewInstance.fields.text],
                        data: curViewDS[this.activeIndex],
                        index: this.activeIndex
                    };
                }
                if (this.listViewInstance.showCheckBox) {
                    eventArgs.isChecked = isChecked;
                    this.listViewInstance.trigger('select', eventArgs);
                }
                else if (!isSelected) {
                    this.listViewInstance.removeSelect();
                    this.listViewInstance.trigger('select', eventArgs);
                }
            }
        }
        else if (sf.base.isNullOrUndefined(obj) && !this.listViewInstance.showCheckBox) {
            this.listViewInstance.removeSelect();
            this.activeIndex = undefined;
        }
        if (sf.base.isBlazor() && this.listViewInstance.isServerRendered) {
            // tslint:disable-next-line:no-any
            var elementId = resutJSON.data[this.listViewInstance.fields.id];
            // tslint:enable-next-line:no-any
            if (this.listViewInstance.showCheckBox) {
                if (!this.listViewInstance.previousSelectedItems.includes(elementId)) {
                    this.listViewInstance.previousSelectedItems.push(elementId);
                }
                else {
                    var indexPosition = this.listViewInstance.previousSelectedItems.indexOf(elementId);
                    if (indexPosition > -1) {
                        this.listViewInstance.previousSelectedItems.splice(indexPosition, 1);
                    }
                }
            }
            else {
                this.listViewInstance.previousSelectedItems[0] = elementId;
            }
            this.listViewInstance.removeActiveClass();
        }
    };
    Virtualization.prototype.enableItem = function (obj) {
        var resutJSON = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (sf.base.isBlazor() && this.listViewInstance.isServerRendered) {
            var itemId = resutJSON.data[this.listViewInstance.fields.id];
            if (!this.listViewInstance.enabledItems.includes(itemId)) {
                this.listViewInstance.enabledItems.push(itemId);
                this.listViewInstance.removeActiveClass();
            }
            if (this.listViewInstance.disabledItems.includes(itemId)) {
                var indexPosition = this.listViewInstance.disabledItems.indexOf(itemId);
                if (indexPosition > -1) {
                    this.listViewInstance.disabledItems.splice(indexPosition, 1);
                }
            }
        }
        else {
            if (Object.keys(resutJSON).length) {
                this.uiIndices.disabledItemIndices.splice(this.uiIndices.disabledItemIndices.indexOf(resutJSON.index), 1);
            }
        }
    };
    Virtualization.prototype.disableItem = function (obj) {
        var resutJSON = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (sf.base.isBlazor() && this.listViewInstance.isServerRendered) {
            var liElementId = resutJSON.data[this.listViewInstance.fields.id];
            if (!this.listViewInstance.disabledItems.includes(liElementId)) {
                this.listViewInstance.disabledItems.push(liElementId);
                this.listViewInstance.removeActiveClass();
            }
            if (this.listViewInstance.enabledItems.includes(liElementId)) {
                var indexPosition = this.listViewInstance.enabledItems.indexOf(liElementId);
                if (indexPosition > -1) {
                    this.listViewInstance.enabledItems.splice(indexPosition, 1);
                }
            }
        }
        else {
            if (Object.keys(resutJSON).length && this.uiIndices.disabledItemIndices.indexOf(resutJSON.index) === -1) {
                this.uiIndices.disabledItemIndices.push(resutJSON.index);
            }
        }
    };
    Virtualization.prototype.showItem = function (obj) {
        var resutJSON = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (sf.base.isBlazor() && this.listViewInstance.isServerRendered) {
            // tslint:disable-next-line:no-any
            var hiddenElementId = resutJSON.data[this.listViewInstance.fields.id];
            // tslint:enable-next-line:no-any
            if (this.listViewInstance.hiddenItems.includes(hiddenElementId)) {
                var indexPosition = this.listViewInstance.hiddenItems.indexOf(hiddenElementId);
                if (indexPosition > -1) {
                    this.listViewInstance.previousSelectedItems.splice(indexPosition, 1);
                    this.listViewInstance.removeActiveClass();
                }
            }
        }
        else {
            if (Object.keys(resutJSON).length) {
                this.uiIndices.hiddenItemIndices.splice(this.uiIndices.hiddenItemIndices.indexOf(resutJSON.index), 1);
            }
        }
    };
    Virtualization.prototype.hideItem = function (obj) {
        var resutJSON = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (sf.base.isBlazor() && this.listViewInstance.isServerRendered) {
            // tslint:disable-next-line:no-any
            var elementId = resutJSON.data[this.listViewInstance.fields.id];
            // tslint:enable-next-line:no-any
            if (!this.listViewInstance.hiddenItems.includes(elementId)) {
                this.listViewInstance.hiddenItems.push(elementId);
                this.listViewInstance.removeActiveClass();
            }
        }
        else {
            if (Object.keys(resutJSON).length && this.uiIndices.hiddenItemIndices.indexOf(resutJSON.index) === -1) {
                this.uiIndices.hiddenItemIndices.push(resutJSON.index);
            }
        }
    };
    Virtualization.prototype.removeItem = function (obj) {
        var dataSource;
        var curViewDS = this.listViewInstance.curViewDS;
        var resutJSON = this.findDSAndIndexFromId(curViewDS, obj);
        if (sf.base.isBlazor() && this.listViewInstance.isServerRendered) {
            if (resutJSON.index !== undefined) {
                // tslint:disable
                this.listViewInstance.interopAdaptor.invokeMethodAsync('RemoveItemPosition', resutJSON.index);
                // tslint:enable
            }
        }
        if (Object.keys(resutJSON).length) {
            dataSource = resutJSON.data;
            if (curViewDS[resutJSON.index - 1] &&
                curViewDS[resutJSON.index - 1].isHeader &&
                (curViewDS[resutJSON.index - 1])
                    .items.length === 1) {
                this.removeUiItem(resutJSON.index - 1);
                this.removeUiItem(resutJSON.index - 1);
            }
            else {
                if (!(sf.base.isBlazor() && this.listViewInstance.isServerRendered)) {
                    this.removeUiItem(resutJSON.index);
                }
            }
        }
        var listDataSource = this.listViewInstance.dataSource instanceof sf.data.DataManager
            ? this.listViewInstance.localData : this.listViewInstance.dataSource;
        var index = listDataSource.indexOf(dataSource);
        if (index !== -1) {
            listDataSource.splice(index, 1);
            this.listViewInstance.setViewDataSource(listDataSource);
        }
        // recollect all the list item into collection
        this.listViewInstance.liCollection =
            this.listViewInstance.curUL.querySelectorAll('li');
    };
    Virtualization.prototype.setCheckboxLI = function (li, e) {
        if (sf.base.isBlazor() && this.listViewInstance.isServerRendered) {
            this.uiFirstIndex = Math.round(this.listViewInstance.element.scrollTop / 36) - 4;
            if (this.uiFirstIndex < 0) {
                this.uiFirstIndex = 0;
            }
        }
        var index = Array.prototype.indexOf.call(this.listViewInstance.curUL.querySelectorAll('li'), li) + this.uiFirstIndex;
        this.activeIndex = Array.prototype.indexOf.call(this.listViewInstance.curUL.querySelectorAll('li'), li) + this.uiFirstIndex;
        if (li.classList.contains(classNames.selected)) {
            if (this.uiIndices.activeIndices.indexOf(index) === -1) {
                this.uiIndices.activeIndices.push(index);
            }
        }
        else {
            this.uiIndices.activeIndices.splice(this.uiIndices.activeIndices.indexOf(index), 1);
        }
    };
    Virtualization.prototype.setSelectLI = function (li, e) {
        this.activeIndex = Array.prototype.indexOf.call(this.listViewInstance.curUL.querySelectorAll('li'), li) + this.uiFirstIndex;
    };
    Virtualization.prototype.checkedItem = function (checked) {
        if (checked) {
            this.uiIndices.activeIndices = [];
            this.activeIndex = undefined;
            var data = this.listViewInstance.curViewDS;
            for (var index = 0; index < data.length; index++) {
                if (!data[index].isHeader) {
                    this.uiIndices.activeIndices.push(index);
                }
            }
        }
        else {
            this.activeIndex = undefined;
            this.uiIndices.activeIndices = [];
        }
    };
    Virtualization.prototype.addUiItem = function (index) {
        // virtually new add list item based on the scollbar position
        // if the scroll bar is at the top, just pretend the new item has been added since no UI
        // change is required for the item that has been added at last but when scroll bar is at the bottom
        // just detach top and inject into bottom to mimic new item is added
        var curViewDs = this.listViewInstance.curViewDS;
        this.changeUiIndices(index, true);
        if (this.activeIndex && this.activeIndex >= index) {
            this.activeIndex++;
        }
        if (this.listViewInstance.showCheckBox &&
            curViewDs[index][this.listViewInstance.fields.isChecked]) {
            this.uiIndices.activeIndices.push(index);
        }
        if (!parseFloat(this.bottomElement.style.height) && !parseFloat(this.topElement.style.height)) {
            this.bottomElement.style.height = parseFloat(this.bottomElement.style.height) + this.listItemHeight + 'px';
        }
        if (parseFloat(this.bottomElement.style.height)) {
            var liItem = this.listViewInstance.curUL.lastElementChild.previousSibling;
            var target = this.listViewInstance.getLiFromObjOrElement(curViewDs[index + 1]) ||
                this.listViewInstance.getLiFromObjOrElement(curViewDs[index + 2]);
            if (target) {
                this.bottomElement.style.height = parseFloat(this.bottomElement.style.height) + this.listItemHeight + 'px';
                this.updateUI(liItem, index, target);
            }
        }
        else {
            var liItem = this.listViewInstance.curUL.firstElementChild.nextSibling;
            var target = void 0;
            if ((Object.keys(this.listViewInstance.curViewDS).length - 1) === index) {
                target = this.listViewInstance.curUL.lastElementChild;
            }
            else {
                target = this.listViewInstance.getLiFromObjOrElement(curViewDs[index + 1]) ||
                    this.listViewInstance.getLiFromObjOrElement(curViewDs[index + 2]);
            }
            this.topElement.style.height = parseFloat(this.topElement.style.height) + this.listItemHeight + 'px';
            this.uiFirstIndex++;
            this.uiLastIndex++;
            if (target) {
                this.updateUI(liItem, index, target);
                this.listViewInstance.isWindow ? window.scrollTo(0, (pageYOffset + this.listItemHeight)) :
                    this.listViewInstance.element.scrollTop += this.listItemHeight;
            }
        }
        this.totalHeight += this.listItemHeight;
        this.listDiff = Math.round(parseFloat(this.topElement.style.height) / this.listItemHeight);
    };
    Virtualization.prototype.removeUiItem = function (index) {
        this.totalHeight -= this.listItemHeight;
        var curViewDS = this.listViewInstance.curViewDS[index];
        var liItem = this.listViewInstance.getLiFromObjOrElement(curViewDS);
        this.listViewInstance.curViewDS.splice(index, 1);
        if (this.activeIndex && this.activeIndex >= index) {
            this.activeIndex--;
        }
        if (liItem) {
            if (this.domItemCount > Object.keys(this.listViewInstance.curViewDS).length) {
                sf.base.detach(liItem);
                this.domItemCount--;
                this.uiLastIndex--;
                this.totalHeight = 0;
            }
            else {
                if (liItem.classList.contains(classNames.disable)) {
                    liItem.classList.remove(classNames.disable);
                    this.uiIndices.disabledItemIndices.splice(this.uiIndices.disabledItemIndices.indexOf(index), 1);
                }
                if (liItem.style.display === 'none') {
                    liItem.style.display = '';
                    this.uiIndices.hiddenItemIndices.splice(this.uiIndices.hiddenItemIndices.indexOf(index), 1);
                }
                if (this.listViewInstance.showCheckBox && liItem.classList.contains(classNames.selected)) {
                    this.listViewInstance.removeSelect();
                    this.uiIndices.activeIndices.splice(this.uiIndices.activeIndices.indexOf(index), 1);
                    var checklistElement = liItem.querySelector('.' + classNames.checkboxWrapper);
                    checklistElement.removeAttribute('aria-checked');
                    checklistElement.firstElementChild.classList.remove(classNames.checked);
                    if (liItem.classList.contains(classNames.focused)) {
                        liItem.classList.remove(classNames.focused);
                        this.activeIndex = undefined;
                    }
                }
                else if (liItem.classList.contains(classNames.selected)) {
                    this.listViewInstance.removeSelect();
                    this.activeIndex = undefined;
                }
                if (!parseFloat(this.bottomElement.style.height) && !parseFloat(this.topElement.style.height)) {
                    this.updateUI(liItem, this.uiLastIndex, this.bottomElement);
                }
                else if (parseFloat(this.bottomElement.style.height)) {
                    this.bottomElement.style.height = parseFloat(this.bottomElement.style.height) - this.listItemHeight + 'px';
                    this.updateUI(liItem, this.uiLastIndex, this.bottomElement);
                }
                else {
                    this.topElement.style.height = parseFloat(this.topElement.style.height) - this.listItemHeight + 'px';
                    this.updateUI(liItem, (this.uiFirstIndex - 1), this.topElement.nextSibling);
                    this.uiLastIndex--;
                    this.uiFirstIndex--;
                }
            }
        }
        this.changeUiIndices(index, false);
        this.listDiff = Math.round(parseFloat(this.topElement.style.height) / this.listItemHeight);
    };
    Virtualization.prototype.changeUiIndices = function (index, increment) {
        var keys = Object.keys(this.uiIndices);
        for (var ind = 0; ind < keys.length; ind++) {
            this.uiIndices[keys[ind]] = this.uiIndices[keys[ind]].map(function (i) {
                if (i >= index) {
                    return increment ? ++i : --i;
                }
                else {
                    return i;
                }
            });
        }
    };
    Virtualization.prototype.addItem = function (data, fields, dataSource) {
        for (var i = 0; i < data.length; i++) {
            var currentItem = data[i];
            // push the given data to main data array
            dataSource.push(currentItem);
            // recalculate all the group data or other datasource related things
            this.listViewInstance.setViewDataSource(dataSource);
            // render list items for first time due to no datasource present earlier
            if (!this.domItemCount) {
                // fresh rendering for first time
                if ((this.listViewInstance.template || this.listViewInstance.groupTemplate) && !this.isNgTemplate()) {
                    this.listViewInstance.listBaseOption.template = null;
                    this.listViewInstance.listBaseOption.groupTemplate = null;
                    this.listViewInstance.listBaseOption.itemCreated = this.createUIItem.bind(this);
                }
                this.uiVirtualization();
                // when expected expected DOM count doesn't meet the condition we need to create and inject new item into DOM
            }
            else if (this.domItemCount < this.expectedDomItemCount) {
                var ds = this.listViewInstance.findItemFromDS(dataSource, fields);
                if (ds instanceof Array) {
                    if (this.listViewInstance.ulElement) {
                        var index = this.listViewInstance.curViewDS.indexOf(currentItem);
                        // inject new list item into DOM
                        this.createAndInjectNewItem(currentItem, index);
                        // check for group header item
                        var curViewDS = this.listViewInstance.curViewDS[index - 1];
                        if (curViewDS && curViewDS.isHeader && curViewDS.items.length === 1) {
                            // target group item index in datasource
                            --index;
                            // inject new group header into DOM for previously created list item
                            this.createAndInjectNewItem(curViewDS, index);
                        }
                    }
                    // recollect all the list item into collection
                    this.listViewInstance.liCollection =
                        this.listViewInstance.curUL.querySelectorAll('li');
                }
            }
            else {
                var index = this.listViewInstance.curViewDS.indexOf(currentItem);
                // virtually new add list item based on the scollbar position
                this.addUiItem(index);
                // check for group header item needs to be added
                var curViewDS = this.listViewInstance.curViewDS[index - 1];
                if (curViewDS && curViewDS.isHeader && curViewDS.items.length === 1) {
                    this.addUiItem(index - 1);
                }
            }
        }
    };
    Virtualization.prototype.createAndInjectNewItem = function (itemData, index) {
        // generate li item for given datasource
        var target;
        var li = sf.lists.ListBase.createListItemFromJson(this.listViewInstance.createElement, [itemData], this.listViewInstance.listBaseOption, null, null, this);
        // check for target element whether to insert before last item or group item
        if ((Object.keys(this.listViewInstance.curViewDS).length - 1) === index) {
            target = this.listViewInstance.curUL.lastElementChild;
        }
        else {
            // target group header's first child item to append its header
            target = this.listViewInstance.getLiFromObjOrElement(this.listViewInstance.curViewDS[index + 1]) ||
                this.listViewInstance.getLiFromObjOrElement(this.listViewInstance.curViewDS[index + 2]);
        }
        // insert before the target element
        this.listViewInstance.ulElement.insertBefore(li[0], target);
        // increment internal DOM count, last index count for new element
        this.domItemCount++;
        if (this.bottomElementHeight <= 0) {
            this.uiLastIndex++;
        }
        // recalculate the current item height, to avoid jumpy scroller
        this.refreshItemHeight();
    };
    Virtualization.prototype.createUIItem = function (args) {
        var virtualTemplate = this.listViewInstance.template;
        var template = this.listViewInstance.createElement('div');
        var commonTemplate = '<div class="e-text-content" role="presentation"> ' +
            '<span class="e-list-text"> ${' + this.listViewInstance.fields.text + '} </span></div>';
        if (this.listViewInstance.showCheckBox) {
            // tslint:disable-next-line:no-any
            this.listViewInstance.renderCheckbox(args);
            // tslint:enable-next-line:no-any
            if ((!sf.base.isNullOrUndefined(this.listViewInstance.virtualCheckBox)) &&
                (!sf.base.isNullOrUndefined(this.listViewInstance.virtualCheckBox.outerHTML))) {
                var div = document.createElement('div');
                div.innerHTML = this.listViewInstance.template || commonTemplate;
                div.children[0].classList.add('e-checkbox');
                this.listViewInstance.checkBoxPosition === 'Left' ? div.children[0].classList.add('e-checkbox-left') :
                    div.children[0].classList.add('e-checkbox-right');
                if (this.listViewInstance.checkBoxPosition === 'Left') {
                    div.children[0].insertBefore(this.listViewInstance.virtualCheckBox, div.childNodes[0].children[0]);
                }
                else {
                    div.children[0].appendChild(this.listViewInstance.virtualCheckBox);
                }
                this.listViewInstance.template = div.innerHTML;
            }
            template.innerHTML = this.listViewInstance.template;
            this.listViewInstance.template = virtualTemplate;
        }
        else {
            template.innerHTML = this.listViewInstance.template || commonTemplate;
        }
        // tslint:disable-next-line:no-any
        var templateElements = template.getElementsByTagName('*');
        var groupTemplate = this.listViewInstance.createElement('div');
        if (this.listViewInstance.fields.groupBy) {
            groupTemplate.innerHTML = this.listViewInstance.groupTemplate || commonTemplate;
        }
        // tslint:disable-next-line:no-any
        var groupTemplateElements = groupTemplate.getElementsByTagName('*');
        if (args.curData.isHeader) {
            this.headerData = args.curData;
        }
        this.templateData = args.curData.isHeader ? args.curData.items[0] :
            args.curData;
        args.item.innerHTML = '';
        args.item.context = { data: args.curData, nodes: { flatTemplateNodes: [], groupTemplateNodes: [] } };
        for (var i = 0; i < templateElements.length; i++) {
            this.compileTemplate(templateElements[i], args.item, false);
        }
        for (var i = 0; i < groupTemplateElements.length; i++) {
            this.compileTemplate(groupTemplateElements[i], args.item, true);
        }
        args.item.context.template = args.curData.isHeader ? template.firstElementChild :
            groupTemplate.firstElementChild;
        args.item.context.type = args.curData.isHeader ? 'flatList' : 'groupList';
        var element = args.curData.isHeader ? groupTemplate : template;
        args.item.insertBefore(element.firstElementChild, null);
    };
    Virtualization.prototype.compileTemplate = function (element, item, isHeader) {
        this.textProperty(element, item, isHeader);
        this.classProperty(element, item, isHeader);
        this.attributeProperty(element, item, isHeader);
    };
    Virtualization.prototype.onChange = function (newData, listElement) {
        listElement.context.data = newData;
        var groupTemplateNodes = listElement.context.nodes.groupTemplateNodes;
        var flatTemplateNodes = listElement.context.nodes.flatTemplateNodes;
        if (!sf.base.isNullOrUndefined(newData.isHeader) && newData.isHeader && listElement.context.type === 'groupList') {
            var element = listElement.firstElementChild;
            sf.base.detach(listElement.firstElementChild);
            listElement.insertBefore(listElement.context.template, null);
            listElement.context.template = element;
            listElement.context.type = 'flatList';
            for (var i = 0; i < groupTemplateNodes.length; i++) {
                groupTemplateNodes[i].onChange(newData);
            }
        }
        else if (!newData.isHeader && listElement.context.type === 'flatList') {
            var element = listElement.firstElementChild;
            sf.base.detach(listElement.firstElementChild);
            listElement.insertBefore(listElement.context.template, null);
            listElement.context.template = element;
            listElement.context.type = 'groupList';
            for (var i = 0; i < flatTemplateNodes.length; i++) {
                flatTemplateNodes[i].onChange(newData);
            }
        }
        else if (!newData.isHeader) {
            for (var i = 0; i < flatTemplateNodes.length; i++) {
                flatTemplateNodes[i].onChange(newData);
            }
        }
        else {
            for (var i = 0; i < groupTemplateNodes.length; i++) {
                groupTemplateNodes[i].onChange(newData);
            }
        }
    };
    Virtualization.prototype.updateContextData = function (listElement, node, isHeader) {
        if (isHeader) {
            listElement.context.nodes.groupTemplateNodes.push(node);
        }
        else {
            listElement.context.nodes.flatTemplateNodes.push(node);
        }
    };
    Virtualization.prototype.classProperty = function (element, listElement, isHeader) {
        var regex = new RegExp('\\${([^}]*)}', 'g');
        var resultantOutput = [];
        var regexMatch;
        while (regexMatch !== null) {
            var match = regex.exec(element.className);
            resultantOutput.push(match);
            regexMatch = match;
            if (regexMatch === null) {
                resultantOutput.pop();
            }
        }
        if (resultantOutput && resultantOutput.length) {
            var _loop_1 = function (i) {
                var classNameMatch = resultantOutput[i];
                var classFunction;
                if (classNameMatch[1].indexOf('?') !== -1 && classNameMatch[1].indexOf(':') !== -1) {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    classFunction = new Function('data', 'return ' + classNameMatch[1].replace(/\$/g, 'data.'));
                }
                else {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    classFunction = new Function('data', 'return ' + 'data.' + classNameMatch[1]);
                }
                var subNode = {};
                if (isHeader) {
                    subNode.bindedvalue = classFunction(this_1.headerData);
                }
                else {
                    subNode.bindedvalue = classFunction(this_1.templateData);
                }
                subNode.onChange = function (value) {
                    if (subNode.bindedvalue) {
                        sf.base.removeClass([element], subNode.bindedvalue.split(' ').filter(function (css) { return css; }));
                    }
                    var newCss = classFunction(value);
                    if (newCss) {
                        sf.base.addClass([element], (newCss).split(' ').filter(function (css) { return css; }));
                    }
                    subNode.bindedvalue = newCss;
                };
                var className = classNameMatch[0].split(' ');
                for (var i_1 = 0; i_1 < className.length; i_1++) {
                    element.classList.remove(className[i_1]);
                }
                if (subNode.bindedvalue) {
                    sf.base.addClass([element], subNode.bindedvalue.split(' ').filter(function (css) { return css; }));
                }
                this_1.updateContextData(listElement, subNode, isHeader);
            };
            var this_1 = this;
            for (var i = 0; i < resultantOutput.length; i++) {
                _loop_1(i);
            }
        }
    };
    Virtualization.prototype.attributeProperty = function (element, listElement, isHeader) {
        var attributeNames = [];
        for (var i = 0; i < element.attributes.length; i++) {
            attributeNames.push(element.attributes[i].nodeName);
        }
        if (attributeNames.indexOf('class') !== -1) {
            attributeNames.splice(attributeNames.indexOf('class'), 1);
        }
        var _loop_2 = function (i) {
            var attributeName = attributeNames[i];
            var attrNameMatch = new RegExp('\\${([^}]*)}', 'g').exec(attributeName) || [];
            var attrValueMatch = new RegExp('\\${([^}]*)}', 'g').exec(element.getAttribute(attributeName))
                || [];
            var attributeNameFunction;
            var attributeValueFunction;
            if (attrNameMatch.length || attrValueMatch.length) {
                if (attrNameMatch[1]) {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    attributeNameFunction = new Function('data', 'return ' + 'data.' + attrNameMatch[1]);
                }
                if (attrValueMatch[1]) {
                    if (attrValueMatch[1].indexOf('?') !== -1 && attrValueMatch[1].indexOf(':') !== -1) {
                        // tslint:disable-next-line:no-function-constructor-with-string-args
                        attributeValueFunction = new Function('data', 'return ' + attrValueMatch[1].replace(/\$/g, 'data.'));
                    }
                    else {
                        // tslint:disable-next-line:no-function-constructor-with-string-args
                        attributeValueFunction = new Function('data', 'return ' + 'data.' + attrValueMatch[1]);
                    }
                }
                var subNode_1 = {};
                if (isHeader) {
                    subNode_1.bindedvalue = [attrNameMatch[1] === undefined ? undefined : attributeNameFunction(this_2.headerData),
                        attrValueMatch[1] === undefined ? undefined : attributeValueFunction(this_2.headerData)];
                }
                else {
                    subNode_1.bindedvalue = [attrNameMatch[1] === undefined ? undefined : attributeNameFunction(this_2.templateData),
                        attrValueMatch[1] === undefined ? undefined : attributeValueFunction(this_2.templateData)];
                }
                subNode_1.attrName = subNode_1.bindedvalue[0] === undefined ?
                    attributeName : subNode_1.bindedvalue[0];
                subNode_1.onChange = function (value) {
                    var bindedvalue = subNode_1.bindedvalue[1] === undefined ?
                        element.getAttribute(subNode_1.attrName) : attributeValueFunction(value);
                    element.removeAttribute(subNode_1.attrName);
                    subNode_1.attrName = subNode_1.bindedvalue[0] === undefined ? subNode_1.attrName : attributeNameFunction(value);
                    element.setAttribute(subNode_1.attrName, bindedvalue);
                    subNode_1.bindedvalue = [subNode_1.bindedvalue[0] === undefined ? undefined : attributeNameFunction(value),
                        subNode_1.bindedvalue[1] === undefined ? undefined : attributeValueFunction(value)];
                };
                var attributeValue = subNode_1.bindedvalue[1] === undefined ? element.getAttribute(attributeName) :
                    subNode_1.bindedvalue[1];
                element.removeAttribute(attributeName);
                element.setAttribute(subNode_1.attrName, attributeValue);
                this_2.updateContextData(listElement, subNode_1, isHeader);
            }
        };
        var this_2 = this;
        for (var i = 0; i < attributeNames.length; i++) {
            _loop_2(i);
        }
    };
    Virtualization.prototype.textProperty = function (element, listElement, isHeader) {
        var regex = new RegExp('\\${([^}]*)}', 'g');
        var resultantOutput = [];
        var regexMatch;
        while (regexMatch !== null) {
            var match = regex.exec(element.innerText);
            resultantOutput.push(match);
            regexMatch = match;
            if (regexMatch === null) {
                resultantOutput.pop();
            }
        }
        var isChildHasTextContent = Array.prototype.some.call(element.children, function (element) {
            if (new RegExp('\\${([^}]*)}', 'g').exec(element.innerText)) {
                return true;
            }
            else {
                return false;
            }
        });
        if (resultantOutput && resultantOutput.length && !isChildHasTextContent) {
            var _loop_3 = function (i) {
                var textPropertyMatch = resultantOutput[i];
                var subNode = {};
                var textFunction;
                if (textPropertyMatch[1].indexOf('?') !== -1 && textPropertyMatch[1].indexOf(':') !== -1) {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    textFunction = new Function('data', 'return ' + textPropertyMatch[1].replace(/\$/g, 'data.'));
                }
                else {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    textFunction = new Function('data', 'return ' + 'data.' + textPropertyMatch[1]);
                }
                if (isHeader) {
                    subNode.bindedvalue = textFunction(this_3.headerData);
                }
                else {
                    subNode.bindedvalue = textFunction(this_3.templateData);
                }
                subNode.onChange = function (value) {
                    element.innerText = element.innerText.replace(subNode.bindedvalue, textFunction(value));
                    subNode.bindedvalue = textFunction(value);
                };
                element.innerText = element.innerText.replace(textPropertyMatch[0], subNode.bindedvalue);
                this_3.updateContextData(listElement, subNode, isHeader);
            };
            var this_3 = this;
            for (var i = 0; i < resultantOutput.length; i++) {
                _loop_3(i);
            }
        }
    };
    Virtualization.prototype.reRenderUiVirtualization = function () {
        this.wireScrollEvent(true);
        if (this.listViewInstance.contentContainer) {
            sf.base.detach(this.listViewInstance.contentContainer);
        }
        this.listViewInstance.preRender();
        // resetting the dom count to 0, to avoid edge case of dataSource suddenly becoming zero
        // and then manually adding item using addItem API
        this.domItemCount = 0;
        this.listViewInstance.header();
        this.listViewInstance.setLocalData();
    };
    Virtualization.prototype.updateUI = function (element, index, targetElement) {
        var onChange = this.isNgTemplate() ? this.onNgChange : this.onChange;
        if (this.listViewInstance.template || this.listViewInstance.groupTemplate) {
            var curViewDS = this.listViewInstance.curViewDS[index];
            element.dataset.uid = curViewDS[this.listViewInstance.fields.id] ?
                curViewDS[this.listViewInstance.fields.id].toString() : sf.lists.ListBase.generateId();
            onChange(curViewDS, element, this);
        }
        else {
            this.updateUiContent(element, index);
        }
        this.changeElementAttributes(element, index);
        if (targetElement) {
            this.listViewInstance.ulElement.insertBefore(element, targetElement);
        }
    };
    Virtualization.prototype.onNgChange = function (newData, listElement, virtualThis) {
        // compile given target element with template for new data
        var templateCompiler = sf.base.compile(virtualThis.listViewInstance.template);
        var resultElement = templateCompiler(newData);
        while (listElement.lastChild) {
            listElement.removeChild(listElement.lastChild);
        }
        listElement.appendChild(resultElement[0]);
    };
    Virtualization.prototype.getModuleName = function () {
        return 'virtualization';
    };
    Virtualization.prototype.destroy = function () {
        this.wireScrollEvent(true);
    };
    return Virtualization;
}());

/**
 * Listview Component
 */

ListView.Inject(Virtualization);

exports.classNames = classNames;
exports.FieldSettings = FieldSettings;
exports.ListView = ListView;
exports.Virtualization = Virtualization;

return exports;

});

    sf.lists = sf.base.extend({}, sf.lists, sflistview({}));