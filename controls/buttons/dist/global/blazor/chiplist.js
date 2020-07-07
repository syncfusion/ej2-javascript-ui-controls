window.sf = window.sf || {};
var sfchips = (function (exports) {
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
var classNames = {
    chipSet: 'e-chip-set',
    chip: 'e-chip',
    avatar: 'e-chip-avatar',
    text: 'e-chip-text',
    icon: 'e-chip-icon',
    delete: 'e-chip-delete',
    deleteIcon: 'e-dlt-btn',
    multiSelection: 'e-multi-selection',
    singleSelection: 'e-selection',
    active: 'e-active',
    chipWrapper: 'e-chip-avatar-wrap',
    iconWrapper: 'e-chip-icon-wrap',
    focused: 'e-focused',
    disabled: 'e-disabled',
    rtl: 'e-rtl',
};
/**
 * A chip component is a small block of essential information, mostly used on contacts or filter tags.
 * ```html
 * <div id="chip"></div>
 * ```
 * ```typescript
 * <script>
 * var chipObj = new ChipList();
 * chipObj.appendTo("#chip");
 * </script>
 * ```
 */
var ChipList = /** @class */ (function (_super) {
    __extends(ChipList, _super);
    function ChipList(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.multiSelectedChip = [];
        return _this;
    }
    /**
     * Initialize the event handler
     * @private
     */
    ChipList.prototype.preRender = function () {
        //prerender
    };
    /**
     * To find the chips length.
     * @returns boolean
     * @private
     */
    ChipList.prototype.chipType = function () {
        return (this.chips && this.chips.length && this.chips.length > 0);
    };
    /**
     * To Initialize the control rendering.
     * @returns void
     * @private
     */
    ChipList.prototype.render = function () {
        this.type = this.chips.length ? 'chipset' : (this.text || this.element.innerText ? 'chip' : 'chipset');
        if (!sf.base.isBlazor() || !this.isServerRendered) {
            this.setAttributes();
            this.createChip();
            this.setRtl();
            this.select(this.selectedChips);
        }
        this.wireEvent(false);
        this.rippleFunction = sf.base.rippleEffect(this.element, {
            selector: '.e-chip'
        });
        this.renderComplete();
    };
    ChipList.prototype.createChip = function () {
        this.innerText = this.element.innerText.trim();
        if (sf.base.isBlazor()) {
            var childElement = this.element.querySelectorAll('.e-chip');
            for (var i = 0; i < childElement.length; i++) {
                if (childElement[i] != null) {
                    sf.base.detach(childElement[i]);
                }
            }
        }
        else {
            this.element.innerHTML = '';
        }
        this.chipCreation(this.type === 'chip' ? [this.innerText ? this.innerText : this.text] : this.chips);
    };
    ChipList.prototype.setAttributes = function () {
        if (this.type === 'chip') {
            this.element.tabIndex = 0;
            this.element.setAttribute('role', 'option');
        }
        else {
            this.element.classList.add(classNames.chipSet);
            this.element.setAttribute('role', 'listbox');
            if (this.selection === 'Multiple') {
                this.element.classList.add(classNames.multiSelection);
                this.element.setAttribute('aria-multiselectable', 'true');
            }
            else if (this.selection === 'Single') {
                this.element.classList.add(classNames.singleSelection);
                this.element.setAttribute('aria-multiselectable', 'false');
            }
            else {
                this.element.setAttribute('aria-multiselectable', 'false');
            }
        }
    };
    ChipList.prototype.setRtl = function () {
        this.element.classList[this.enableRtl ? 'add' : 'remove'](classNames.rtl);
    };
    ChipList.prototype.chipCreation = function (data) {
        var chipListArray = [];
        for (var i = 0; i < data.length; i++) {
            var fieldsData = this.getFieldValues(data[i]);
            var chipArray = this.elementCreation(fieldsData);
            var className = (classNames.chip + ' ' + (fieldsData.enabled ? ' ' : classNames.disabled) + ' ' +
                (fieldsData.avatarIconCss || fieldsData.avatarText ? classNames.chipWrapper : (fieldsData.leadingIconCss ?
                    classNames.iconWrapper : ' ')) + ' ' + fieldsData.cssClass).split(' ').filter(function (css) { return css; });
            if (!this.chipType()) {
                chipListArray = chipArray;
                sf.base.addClass([this.element], className);
                this.element.setAttribute('aria-label', fieldsData.text);
                if (fieldsData.value) {
                    this.element.setAttribute('data-value', fieldsData.value.toString());
                }
            }
            else {
                var wrapper = this.createElement('DIV', {
                    className: className.join(' '), attrs: {
                        tabIndex: '0', role: 'option',
                        'aria-label': fieldsData.text, 'aria-selected': 'false'
                    }
                });
                if (fieldsData.value) {
                    wrapper.setAttribute('data-value', fieldsData.value.toString());
                }
                sf.base.append(chipArray, wrapper);
                chipListArray.push(wrapper);
            }
        }
        sf.base.append(chipListArray, this.element);
    };
    ChipList.prototype.getFieldValues = function (data) {
        var chipEnabled = !(this.enabled.toString() === 'false');
        var fields = {
            text: typeof data === 'object' ? (data.text ? data.text.toString() : this.text.toString()) :
                (!this.chipType() ? (this.innerText ? this.innerText : this.text.toString()) : data.toString()),
            cssClass: typeof data === 'object' ? (data.cssClass ? data.cssClass.toString() : this.cssClass.toString()) :
                (this.cssClass.toString()),
            leadingIconCss: typeof data === 'object' ? (data.leadingIconCss ? data.leadingIconCss.toString() :
                this.leadingIconCss.toString()) : (this.leadingIconCss.toString()),
            avatarIconCss: typeof data === 'object' ? (data.avatarIconCss ? data.avatarIconCss.toString() :
                this.avatarIconCss.toString()) : (this.avatarIconCss.toString()),
            avatarText: typeof data === 'object' ? (data.avatarText ? data.avatarText.toString() : this.avatarText.toString()) :
                (this.avatarText.toString()),
            trailingIconCss: typeof data === 'object' ? (data.trailingIconCss ? data.trailingIconCss.toString() :
                this.trailingIconCss.toString()) : (this.trailingIconCss.toString()),
            enabled: typeof data === 'object' ? (!sf.base.isNullOrUndefined(data.enabled) ? (data.enabled.toString() === 'false' ? false : true) :
                chipEnabled) : (chipEnabled),
            value: typeof data === 'object' ? ((data.value ? data.value.toString() : null)) : null,
            leadingIconUrl: typeof data === 'object' ? (data.leadingIconUrl ? data.leadingIconUrl.toString() : this.leadingIconUrl) :
                this.leadingIconUrl,
            trailingIconUrl: typeof data === 'object' ? (data.trailingIconUrl ? data.trailingIconUrl.toString() : this.trailingIconUrl) :
                this.trailingIconUrl
        };
        return fields;
    };
    ChipList.prototype.elementCreation = function (fields) {
        var chipArray = [];
        if (fields.avatarText || fields.avatarIconCss) {
            var className = (classNames.avatar + ' ' + fields.avatarIconCss).trim();
            var chipAvatarElement = this.createElement('span', { className: className });
            chipAvatarElement.innerText = fields.avatarText;
            chipArray.push(chipAvatarElement);
        }
        else if (fields.leadingIconCss) {
            var className = (classNames.icon + ' ' + fields.leadingIconCss).trim();
            var chipIconElement = this.createElement('span', { className: className });
            chipArray.push(chipIconElement);
        }
        else if (fields.leadingIconUrl) {
            var className = (classNames.avatar + ' ' + 'image-url').trim();
            var chipIconElement = this.createElement('span', { className: className });
            chipIconElement.style.backgroundImage = 'url(' + fields.leadingIconUrl + ')';
            chipArray.push(chipIconElement);
        }
        var chipTextElement = this.createElement('span', { className: classNames.text });
        chipTextElement.innerText = fields.text;
        chipArray.push(chipTextElement);
        if (fields.trailingIconCss || (this.chipType() && this.enableDelete)) {
            var className = (classNames.delete + ' ' +
                (fields.trailingIconCss ? fields.trailingIconCss : classNames.deleteIcon)).trim();
            var chipdeleteElement = this.createElement('span', { className: className });
            chipArray.push(chipdeleteElement);
        }
        else if (fields.trailingIconUrl) {
            var className = ('trailing-icon-url').trim();
            var chipIconsElement = this.createElement('span', { className: className });
            chipIconsElement.style.backgroundImage = 'url(' + fields.trailingIconUrl + ')';
            chipArray.push(chipIconsElement);
        }
        return chipArray;
    };
    /**
     * A function that finds chip based on given input.
     * @param  {number | HTMLElement } fields - We can pass index number or element of chip.
     */
    ChipList.prototype.find = function (fields) {
        var chipData;
        var chipElement = fields instanceof HTMLElement ?
            fields : this.element.querySelectorAll('.' + classNames.chip)[fields];
        if (chipElement && this.chipType()) {
            chipData = { text: undefined, index: undefined, element: undefined, data: undefined };
            chipData.index = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.chip)).indexOf(chipElement);
            chipData.text = typeof this.chips[chipData.index] === 'object' ?
                (this.chips[chipData.index].text ?
                    this.chips[chipData.index].text.toString() : '') :
                this.chips[chipData.index].toString();
            chipData.data = this.chips[chipData.index];
            chipData.element = chipElement;
        }
        return chipData;
    };
    /**
     * Allows adding the chip item(s) by passing a single or array of string, number, or ChipModel values.
     * @param  {string[] | number[] | ChipModel[] | string | number | ChipModel} chipsData - We can pass array of string or
     *  array of number or array of chip model or string data or number data or chip model.
     * @deprecated
     */
    ChipList.prototype.add = function (chipsData) {
        var _a;
        if (this.type !== 'chip') {
            var fieldData = chipsData instanceof Array ?
                chipsData : [chipsData];
            (_a = this.chips).push.apply(_a, fieldData);
            this.chipCreation(fieldData);
        }
    };
    /**
     * Allows selecting the chip item(s) by passing a single or array of string, number, or ChipModel values.
     * @param  {number | number[] | HTMLElement | HTMLElement[]} fields - We can pass number or array of number
     *  or chip element or array of chip element.
     */
    ChipList.prototype.select = function (fields) {
        this.onSelect(fields, false);
    };
    ChipList.prototype.multiSelection = function (newProp) {
        var items = this.element.querySelectorAll('.' + 'e-chip');
        for (var j = 0; j < newProp.length; j++) {
            if (typeof newProp[j] === 'string') {
                for (var k = 0; k < items.length; k++) {
                    if (newProp[j] !== k) {
                        if (newProp[j] === items[k].attributes[5].value) {
                            this.multiSelectedChip.push(k);
                            break;
                        }
                    }
                }
            }
            else {
                this.multiSelectedChip.push(newProp[j]);
            }
        }
    };
    ChipList.prototype.onSelect = function (fields, callFromProperty) {
        if (this.chipType() && this.selection !== 'None') {
            if (callFromProperty) {
                var chipElements = this.element.querySelectorAll('.' + classNames.chip);
                for (var i = 0; i < chipElements.length; i++) {
                    chipElements[i].setAttribute('aria-selected', 'false');
                    chipElements[i].classList.remove(classNames.active);
                }
            }
            var fieldData = fields instanceof Array ? fields : [fields];
            for (var i = 0; i < fieldData.length; i++) {
                var chipElement = fieldData[i] instanceof HTMLElement ? fieldData[i]
                    : this.element.querySelectorAll('.' + classNames.chip)[fieldData[i]];
                if (chipElement instanceof HTMLElement) {
                    this.selectionHandler(chipElement);
                }
            }
        }
    };
    /**
     * Allows removing the chip item(s) by passing a single or array of string, number, or ChipModel values.
     * @param  {number | number[] | HTMLElement | HTMLElement[]} fields - We can pass number or array of number
     *  or chip element or array of chip element.
     */
    ChipList.prototype.remove = function (fields) {
        var _this = this;
        if (this.chipType()) {
            var fieldData = fields instanceof Array ? fields : [fields];
            var chipElements_1 = [];
            var chipCollection_1 = this.element.querySelectorAll('.' + classNames.chip);
            fieldData.forEach(function (data) {
                var chipElement = data instanceof HTMLElement ? data
                    : chipCollection_1[data];
                if (chipElement instanceof HTMLElement) {
                    chipElements_1.push(chipElement);
                }
            });
            chipElements_1.forEach(function (element) {
                var chips = _this.element.querySelectorAll('.' + classNames.chip);
                var index = Array.prototype.slice.call(chips).indexOf(element);
                _this.deleteHandler(element, index);
            });
        }
    };
    /**
     * Returns the selected chip(s) data.
     */
    ChipList.prototype.getSelectedChips = function () {
        var selectedChips;
        if (this.chipType() && this.selection !== 'None') {
            var selectedItems = { texts: [], Indexes: [], data: [], elements: [] };
            var items = this.element.querySelectorAll('.' + classNames.active);
            for (var i = 0; i < items.length; i++) {
                var chip = items[i];
                selectedItems.elements.push(chip);
                var index = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.chip)).indexOf(chip);
                selectedItems.Indexes.push(index);
                selectedItems.data.push(this.chips[index]);
                var text = typeof this.chips[index] === 'object' ?
                    this.chips[index].text ? this.chips[index].text.toString()
                        : null : this.chips[index].toString();
                selectedItems.texts.push(text);
            }
            var selectedItem = {
                text: selectedItems.texts[0], index: selectedItems.Indexes[0],
                data: selectedItems.data[0], element: selectedItems.elements[0]
            };
            selectedChips = !sf.base.isNullOrUndefined(selectedItem.index) ?
                (this.selection === 'Multiple' ? selectedItems : selectedItem) : undefined;
        }
        return selectedChips;
    };
    ChipList.prototype.wireEvent = function (unWireEvent) {
        if (!unWireEvent) {
            sf.base.EventHandler.add(this.element, 'click', this.clickHandler, this);
            sf.base.EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
            sf.base.EventHandler.add(this.element, 'keydown', this.keyHandler, this);
            sf.base.EventHandler.add(this.element, 'keyup', this.keyHandler, this);
        }
        else {
            sf.base.EventHandler.remove(this.element, 'click', this.clickHandler);
            sf.base.EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
            sf.base.EventHandler.remove(this.element, 'keydown', this.keyHandler);
            sf.base.EventHandler.remove(this.element, 'keyup', this.keyHandler);
        }
    };
    ChipList.prototype.keyHandler = function (e) {
        if (e.target.classList.contains(classNames.chip)) {
            if (e.type === 'keydown') {
                if (e.keyCode === 13) {
                    this.clickHandler(e);
                }
                else if (e.keyCode === 46 && this.enableDelete) {
                    this.clickHandler(e, true);
                }
            }
            else if (e.keyCode === 9) {
                this.focusInHandler(e.target);
            }
        }
    };
    ChipList.prototype.focusInHandler = function (chipWrapper) {
        if (!chipWrapper.classList.contains(classNames.focused)) {
            chipWrapper.classList.add(classNames.focused);
        }
    };
    ChipList.prototype.focusOutHandler = function (e) {
        var chipWrapper = sf.base.closest(e.target, '.' + classNames.chip);
        var focusedElement = !this.chipType() ? (this.element.classList.contains(classNames.focused) ?
            this.element : null) : this.element.querySelector('.' + classNames.focused);
        if (chipWrapper && focusedElement) {
            focusedElement.classList.remove(classNames.focused);
        }
    };
    ChipList.prototype.clickHandler = function (e, del) {
        var _this = this;
        if (del === void 0) { del = false; }
        var chipWrapper = sf.base.closest(e.target, '.' + classNames.chip);
        if (chipWrapper) {
            var chipDataArgs = void 0;
            if (this.chipType()) {
                chipDataArgs = this.find(chipWrapper);
            }
            else {
                var index = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.chip)).indexOf(chipWrapper);
                chipDataArgs = {
                    text: this.innerText ? this.innerText : this.text,
                    element: chipWrapper, data: this.text, index: index
                };
            }
            chipDataArgs.event = e;
            chipDataArgs.cancel = false;
            this.trigger('beforeClick', chipDataArgs, function (observedArgs) {
                if (!observedArgs.cancel) {
                    observedArgs.element = sf.base.isBlazor() ? sf.base.getElement(observedArgs.element) : observedArgs.element;
                    _this.clickEventHandler(observedArgs.element, e, del);
                }
            });
        }
    };
    ChipList.prototype.clickEventHandler = function (chipWrapper, e, del) {
        var _this = this;
        if (this.chipType()) {
            var chipData = this.find(chipWrapper);
            chipData.event = e;
            var deleteElement = e.target.classList.contains(classNames.deleteIcon) ?
                e.target : (del ? chipWrapper.querySelector('.' + classNames.deleteIcon) : undefined);
            if (deleteElement && this.enableDelete) {
                chipData.cancel = false;
                var deletedItemArgs = chipData;
                this.trigger('delete', deletedItemArgs, function (observedArgs) {
                    if (!observedArgs.cancel) {
                        observedArgs.element = sf.base.isBlazor() ? sf.base.getElement(observedArgs.element) : observedArgs.element;
                        _this.deleteHandler(observedArgs.element, observedArgs.index);
                    }
                });
            }
            else if (this.selection !== 'None') {
                this.selectionHandler(chipWrapper);
                chipData.selected = chipWrapper.classList.contains(classNames.active);
                var selectedItemArgs = chipData;
                this.trigger('click', selectedItemArgs);
            }
            else {
                this.focusInHandler(chipWrapper);
                var clickedItemArgs = chipData;
                this.trigger('click', clickedItemArgs);
            }
        }
        else {
            this.focusInHandler(chipWrapper);
            var clickedItemArgs = {
                text: this.innerText ? this.innerText : this.text,
                element: chipWrapper, data: this.text, event: e
            };
            this.trigger('click', clickedItemArgs);
        }
    };
    ChipList.prototype.selectionHandler = function (chipWrapper) {
        if (this.selection === 'Single') {
            var activeElement = this.element.querySelector('.' + classNames.active);
            if (activeElement && activeElement !== chipWrapper) {
                activeElement.classList.remove(classNames.active);
                activeElement.setAttribute('aria-selected', 'false');
            }
            this.setProperties({ selectedChips: null }, true);
        }
        else {
            this.setProperties({ selectedChips: [] }, true);
        }
        if (chipWrapper.classList.contains(classNames.active)) {
            chipWrapper.classList.remove(classNames.active);
            chipWrapper.setAttribute('aria-selected', 'false');
        }
        else {
            chipWrapper.classList.add(classNames.active);
            chipWrapper.setAttribute('aria-selected', 'true');
        }
        this.updateSelectedChips();
    };
    ChipList.prototype.updateSelectedChips = function () {
        var chipListEle = this.element.querySelectorAll('.e-chip');
        var chipCollIndex = [];
        var chipCollValue = [];
        var chip = null;
        var value;
        for (var i = 0; i < chipListEle.length; i++) {
            var selectedEle = this.element.querySelectorAll('.e-chip')[i];
            if (selectedEle.getAttribute('aria-selected') === 'true') {
                value = selectedEle.getAttribute('data-value');
                if (this.selection === 'Single' && selectedEle.classList.contains('e-active')) {
                    chip = value ? value : i;
                    break;
                }
                else {
                    value ? chipCollValue.push(value) : chipCollIndex.push(i);
                }
            }
        }
        this.setProperties({ selectedChips: this.selection === 'Single' ? chip : value ? chipCollValue : chipCollIndex }, true);
    };
    ChipList.prototype.deleteHandler = function (chipWrapper, index) {
        this.allowServerDataBinding = true;
        this.chips.splice(index, 1);
        this.setProperties({ chips: this.chips }, true);
        this.serverDataBind();
        this.allowServerDataBinding = false;
        if (!(sf.base.isBlazor() && this.isServerRendered)) {
            sf.base.detach(chipWrapper);
        }
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also, it removes the attributes and classes.
     */
    ChipList.prototype.destroy = function () {
        sf.base.removeClass([this.element], [classNames.chipSet, classNames.chip, classNames.rtl,
            classNames.multiSelection, classNames.singleSelection, classNames.disabled, classNames.chipWrapper, classNames.iconWrapper,
            classNames.active, classNames.focused].concat(this.cssClass.toString().split(' ').filter(function (css) { return css; })));
        this.removeMultipleAttributes(['tabindex', 'role', 'aria-label', 'aria-multiselectable'], this.element);
        this.wireEvent(true);
        this.rippleFunction();
        if (sf.base.isBlazor()) {
            var chipChildElement = !this.chipType() ? this.element.querySelectorAll('.e-chip-text') :
                this.element.querySelectorAll('.e-chip');
            for (var i = 0; i < chipChildElement.length; i++) {
                if (chipChildElement[i] != null) {
                    sf.base.detach(chipChildElement[i]);
                }
            }
        }
        else {
            _super.prototype.destroy.call(this);
            this.element.innerHTML = '';
            this.element.innerText = this.innerText;
        }
    };
    ChipList.prototype.removeMultipleAttributes = function (attributes, element) {
        attributes.forEach(function (attr) {
            element.removeAttribute(attr);
        });
    };
    ChipList.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    ChipList.prototype.getModuleName = function () {
        return 'chip-list';
    };
    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @private
     */
    ChipList.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'chips':
                case 'text':
                case 'avatarText':
                case 'avatarIconCss':
                case 'leadingIconCss':
                case 'trailingIconCss':
                case 'selection':
                case 'enableDelete':
                case 'enabled':
                    if (!(sf.base.isBlazor() && this.isServerRendered)) {
                        this.isServerRendered = false;
                        this.refresh();
                        this.isServerRendered = true;
                    }
                    break;
                case 'cssClass':
                    if (!(sf.base.isBlazor() && this.isServerRendered)) {
                        if (!this.chipType()) {
                            sf.base.removeClass([this.element], oldProp.cssClass.toString().split(' ').filter(function (css) { return css; }));
                            sf.base.addClass([this.element], newProp.cssClass.toString().split(' ').filter(function (css) { return css; }));
                        }
                        else {
                            this.isServerRendered = false;
                            this.refresh();
                            this.isServerRendered = true;
                        }
                    }
                    break;
                case 'selectedChips':
                    sf.base.removeClass(this.element.querySelectorAll('.e-active'), 'e-active');
                    if (this.selection === 'Multiple') {
                        this.multiSelectedChip = [];
                        this.multiSelection(newProp.selectedChips);
                        this.onSelect(this.multiSelectedChip, true);
                        this.updateSelectedChips();
                    }
                    else {
                        this.onSelect(newProp.selectedChips, true);
                    }
                    break;
                case 'enableRtl':
                    this.setRtl();
                    break;
            }
        }
    };
    __decorate([
        sf.base.Property([])
    ], ChipList.prototype, "chips", void 0);
    __decorate([
        sf.base.Property('')
    ], ChipList.prototype, "text", void 0);
    __decorate([
        sf.base.Property('')
    ], ChipList.prototype, "avatarText", void 0);
    __decorate([
        sf.base.Property('')
    ], ChipList.prototype, "avatarIconCss", void 0);
    __decorate([
        sf.base.Property('')
    ], ChipList.prototype, "leadingIconCss", void 0);
    __decorate([
        sf.base.Property('')
    ], ChipList.prototype, "trailingIconCss", void 0);
    __decorate([
        sf.base.Property('')
    ], ChipList.prototype, "leadingIconUrl", void 0);
    __decorate([
        sf.base.Property('')
    ], ChipList.prototype, "trailingIconUrl", void 0);
    __decorate([
        sf.base.Property('')
    ], ChipList.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(true)
    ], ChipList.prototype, "enabled", void 0);
    __decorate([
        sf.base.Property([])
    ], ChipList.prototype, "selectedChips", void 0);
    __decorate([
        sf.base.Property('None')
    ], ChipList.prototype, "selection", void 0);
    __decorate([
        sf.base.Property(false)
    ], ChipList.prototype, "enableDelete", void 0);
    __decorate([
        sf.base.Event()
    ], ChipList.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], ChipList.prototype, "click", void 0);
    __decorate([
        sf.base.Event()
    ], ChipList.prototype, "beforeClick", void 0);
    __decorate([
        sf.base.Event()
    ], ChipList.prototype, "delete", void 0);
    ChipList = __decorate([
        sf.base.NotifyPropertyChanges
    ], ChipList);
    return ChipList;
}(sf.base.Component));

/**
 * Represents ChipList `Chip` model class.
 */
var Chip = /** @class */ (function () {
    function Chip() {
    }
    return Chip;
}());

/**
 * Chip modules
 */

exports.classNames = classNames;
exports.ChipList = ChipList;
exports.Chip = Chip;

return exports;

});
sfBlazor.modules["chiplist"] = "buttons.ChipList";
sfBlazor.loadDependencies(sfBlazor.dependencyJson.chiplist, () => {
    sf.buttons = sf.base.extend({}, sf.buttons, sfchips({}));
});