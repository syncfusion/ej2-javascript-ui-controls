import { createCheckBox } from '@syncfusion/ej2-buttons';
import { IMulitSelect } from './interface';
import { Input, InputObject } from '@syncfusion/ej2-inputs';
import { EventHandler, select, removeClass, addClass, detach, compile, L10n } from '@syncfusion/ej2-base';
import { Browser, attributes, isNullOrUndefined, KeyboardEventArgs, append, closest, prepend } from '@syncfusion/ej2-base';
import { dropDownBaseClasses } from '../drop-down-base/drop-down-base';
import { MultiSelectModel } from '../multi-select';


const ICON: string = 'e-icons';
const CHECKBOXFRAME: string = 'e-frame';
const CHECK: string = 'e-check';
const CHECKBOXWRAP: string = 'e-checkbox-wrapper';
const INDETERMINATE: string = 'e-stop';
const checkAllParent: string = 'e-selectall-parent';
const searchBackIcon: string = 'e-input-group-icon e-back-icon e-icons';
const filterBarClearIcon: string = 'e-input-group-icon e-clear-icon e-icons';
const filterInput: string = 'e-input-filter';
const filterParent: string = 'e-filter-parent';
const mobileFilter: string = 'e-ddl-device-filter';
const clearIcon: string = 'e-clear-icon';
const popupFullScreen: string = 'e-popup-full-page';
const device: string = 'e-ddl-device';
const FOCUS: string = 'e-input-focus';

/**
 * The Multiselect enable CheckBoxSelection call this inject module.
 */

export class CheckBoxSelection {
    private parent: IMulitSelect;
    private checkAllParent: HTMLElement;
    private selectAllSpan: HTMLElement;
    public filterInput: HTMLInputElement;
    private filterInputObj: InputObject;
    private backIconElement: Element;
    private clearIconElement: Element;
    private checkWrapper: HTMLElement;
    public list: HTMLElement;
    private activeLi: HTMLElement[] = [];
    private activeEle: HTMLElement[] = [];
    public constructor(parent?: IMulitSelect) {
        this.parent = parent;
        this.removeEventListener();
        this.addEventListener();
    }
    public getModuleName(): string {
        return 'CheckBoxSelection';
    }

    public addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on('updatelist', this.listSelection, this);
        this.parent.on('listoption', this.listOption, this);
        this.parent.on('selectAll', this.setSelectAll, this);
        this.parent.on('checkSelectAll', this.checkSelectAll, this);
        this.parent.on('searchBox', this.setSearchBox, this);
        this.parent.on('blur', this.onBlurHandler, this);
        this.parent.on('targetElement', this.targetElement, this);
        this.parent.on('deviceSearchBox', this.setDeviceSearchBox, this);
        this.parent.on('inputFocus', this.getFocus, this);
        this.parent.on('reOrder', this.setReorder, this);
        this.parent.on('activeList', this.getActiveList, this);
        this.parent.on('selectAllText', this.setLocale, this);
        this.parent.on('filterBarPlaceholder', this.setPlaceholder, this);
        EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        this.parent.on('addItem', this.checboxCreate, this);
        this.parent.on('popupFullScreen', this.setPopupFullScreen, this);
    }
    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updatelist', this.listSelection);
        this.parent.off('listoption', this.listOption);
        this.parent.off('selectAll', this.setSelectAll);
        this.parent.off('checkSelectAll', this.checkSelectAll);
        this.parent.off('searchBox', this.setSearchBox);
        this.parent.off('blur', this.onBlurHandler);
        this.parent.off('targetElement', this.targetElement);
        this.parent.off('deviceSearchBox', this.setDeviceSearchBox);
        this.parent.off('inputFocus', this.getFocus);
        this.parent.off('reOrder', this.setReorder);
        this.parent.off('activeList', this.getActiveList);
        this.parent.off('selectAllText', this.setLocale);
        this.parent.off('filterBarPlaceholder', this.setPlaceholder);
        this.parent.off('addItem', this.checboxCreate);
        this.parent.off('popupFullScreen', this.setPopupFullScreen);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public listOption(args: { [key: string]: Object }): void {
        if (isNullOrUndefined(this.parent.listCurrentOptions.itemCreated)) {
            this.parent.listCurrentOptions.itemCreated = (e: { [key: string]: HTMLElement }) => {
                this.checboxCreate(e);
            };
        } else {
            const itemCreated: Function = <Function>this.parent.listCurrentOptions.itemCreated;
            this.parent.listCurrentOptions.itemCreated = (e: { [key: string]: HTMLElement }) => {
                this.checboxCreate(e);
                itemCreated.apply(this, [e]);
            };
        }
    }
    private setPlaceholder(props: MultiSelectModel): void {
        Input.setPlaceholder(props.filterBarPlaceholder, this.filterInput as HTMLInputElement);
    }
    private checboxCreate(e: { [key: string]: HTMLElement } | HTMLElement): { [key: string]: HTMLElement } | HTMLElement {
        let item: { [key: string]: HTMLElement } | HTMLElement;
        if (!isNullOrUndefined((e as { [key: string]: HTMLElement }).item)) {
            item = (e as { [key: string]: HTMLElement }).item;
        } else {
            item = e;
        }
        if (this.parent.enableGroupCheckBox || ((item as HTMLElement).className !== 'e-list-group-item '
        && (item as HTMLElement).className !== 'e-list-group-item')) {
            const checkboxEle: HTMLElement | Element | string = createCheckBox(this.parent.createElement, true);
            const icon: Element = select('div.' + ICON, (item as HTMLElement));
            (item as HTMLElement).insertBefore(checkboxEle, (item as HTMLElement).childNodes[isNullOrUndefined(icon) ? 0 : 1]);
            select('.' + CHECKBOXFRAME, checkboxEle);
            if (this.parent.enableGroupCheckBox ) {
                this.parent.popupWrapper.classList.add('e-multiselect-group');
            }
            return item;
        } else {
            return item;
        }
    }

    private setSelectAll(): void {
        if (this.parent.showSelectAll) {
            if (isNullOrUndefined(this.checkAllParent)) {
                this.checkAllParent = this.parent.createElement('div', {
                    className: checkAllParent
                });
                this.selectAllSpan = this.parent.createElement('span', {
                    className: 'e-all-text'
                });
                this.selectAllSpan.textContent = '';
                this.checkAllParent.appendChild(this.selectAllSpan);
                this.setLocale();
                this.checboxCreate(this.checkAllParent as { [key: string]: HTMLElement } | HTMLElement);
                if (this.parent.headerTemplate) {
                    if (!isNullOrUndefined(this.parent.filterParent)) {
                        append([this.checkAllParent], this.parent.filterParent);
                    } else {
                        append([this.checkAllParent], this.parent.popupWrapper);
                    }
                }
                if (!this.parent.headerTemplate) {
                    if (!isNullOrUndefined(this.parent.filterParent)) {
                        this.parent.filterParent.parentNode.insertBefore(this.checkAllParent, this.parent.filterParent.nextSibling);
                    } else {
                        prepend([this.checkAllParent], this.parent.popupWrapper);
                    }
                }
                EventHandler.add(this.checkAllParent, 'mousedown', this.clickHandler, this);
            }
            if (this.parent.list.classList.contains('e-nodata') || (this.parent.listData && this.parent.listData.length <= 1 &&
                !(this.parent.isDynamicDataChange)) || (this.parent.isDynamicDataChange &&
                !isNullOrUndefined(this.parent.value) && this.parent.value.length <= 1)) {
                this.checkAllParent.style.display = 'none';
            } else {
                this.checkAllParent.style.display = 'block';
            }
            this.parent.selectAllHeight = this.checkAllParent.getBoundingClientRect().height;
        } else if (!isNullOrUndefined(this.checkAllParent)) {
            this.checkAllParent.parentElement.removeChild(this.checkAllParent);
            this.checkAllParent = null;
        }
    }

    public destroy(): void {
        this.removeEventListener();
        EventHandler.remove(document, 'mousedown', this.onDocumentClick);
    }
    public listSelection(args: IUpdateListArgs): void {
        let target: EventTarget;
        if (!isNullOrUndefined(args.e)) {
            const frameElm: Element = args.li.querySelector('.e-checkbox-wrapper .e-frame');
            target = !isNullOrUndefined(args.e.target) ?
                ((args.e.target as HTMLElement).classList.contains('e-frame')
                && (!this.parent.showSelectAll
                    || ( this.checkAllParent && !this.checkAllParent.contains(args.e.target as Element)))) ?
                    args.e.target : args.li.querySelector('.e-checkbox-wrapper').childNodes[1]
                : args.li.querySelector('.e-checkbox-wrapper').childNodes[1];
        } else {
            const checkboxWrapper: Element = args.li.querySelector('.e-checkbox-wrapper');
            target = checkboxWrapper ? checkboxWrapper.childNodes[1] : args.li.lastElementChild.childNodes[1];
        }
        if (this.parent.itemTemplate || this.parent.enableGroupCheckBox ) {
            target = args.li.firstElementChild.childNodes[1];
        }
        if (!isNullOrUndefined(target)) {
            this.checkWrapper = closest((target as HTMLElement), '.' + CHECKBOXWRAP) as HTMLElement;
        }
        if (!isNullOrUndefined(this.checkWrapper)) {
            const checkElement: Element = select('.' + CHECKBOXFRAME, this.checkWrapper);
            const selectAll: boolean = false;
            this.validateCheckNode(this.checkWrapper, checkElement.classList.contains(CHECK), args.li, args.e, selectAll);
        }
    }
    private validateCheckNode(
        checkWrap: HTMLElement | Element,
        isCheck: boolean, li?: HTMLElement | Element,
        e?: KeyboardEventArgs | MouseEvent, selectAll?: boolean): void {
        this.changeState(checkWrap, isCheck ? 'uncheck' : 'check', e, true, selectAll);
    }
    private clickHandler(e: MouseEvent): void {
        let target: EventTarget;
        if ((e.currentTarget as HTMLElement).classList.contains(this.checkAllParent.className)) {
            target = (e.currentTarget as HTMLElement).firstElementChild.lastElementChild;
        } else {
            target = <Element>e.currentTarget;
        }
        this.checkWrapper = closest((target as HTMLElement), '.' + CHECKBOXWRAP) as HTMLElement;
        const selectAll: boolean = true;
        if (!isNullOrUndefined(this.checkWrapper)) {
            const checkElement: Element = select('.' + CHECKBOXFRAME, this.checkWrapper);
            this.validateCheckNode(this.checkWrapper, checkElement.classList.contains(CHECK), null, e, selectAll);
        }
        e.preventDefault();
    }
    private changeState(
        wrapper: HTMLElement | Element, state: string, e?: MouseEvent | KeyboardEventArgs, isPrevent?: boolean, selectAll?: boolean): void {
        let ariaState: string;
        const frameSpan: Element = wrapper.getElementsByClassName(CHECKBOXFRAME)[0];
        if (state === 'check' && !frameSpan.classList.contains(CHECK)) {
            frameSpan.classList.remove(INDETERMINATE);
            frameSpan.classList.add(CHECK);
            ariaState = 'true';
            if (selectAll) {
                this.parent.selectAllItems(true, e as MouseEvent);
                this.setLocale(true);
            }
        } else if (state === 'uncheck' && (frameSpan.classList.contains(CHECK) || frameSpan.classList.contains(INDETERMINATE))) {
            removeClass([frameSpan], [CHECK, INDETERMINATE]);
            ariaState = 'false';
            if (selectAll) {
                this.parent.selectAllItems(false, e as MouseEvent);
                this.setLocale();
            }
        } else if (state === 'indeterminate' && !(frameSpan.classList.contains(INDETERMINATE))) {
            removeClass([frameSpan], [CHECK]);
            frameSpan.classList.add(INDETERMINATE);
            ariaState = 'false';
            if (selectAll) {
                this.parent.selectAllItems(false, e as MouseEvent);
                this.setLocale();
            }
        }
        ariaState = state === 'check' ? 'true' : state === 'uncheck' ? 'false' : ariaState;
        if (!isNullOrUndefined(ariaState)) {
            wrapper.setAttribute('aria-checked', ariaState);
        }
    }
    protected setSearchBox(args: IUpdateListArgs): InputObject | void {
        if (isNullOrUndefined(this.parent.filterParent)) {
            this.parent.filterParent = this.parent.createElement('span', {
                className: filterParent
            });
            this.filterInput = <HTMLInputElement>this.parent.createElement('input', {
                attrs: { type: 'text' },
                className: filterInput
            });
            this.parent.element.parentNode.insertBefore(this.filterInput, this.parent.element);
            let backIcon: boolean = false;
            if (Browser.isDevice) {
                backIcon = true;
                this.parent.mobFilter = false;
            }
            this.filterInputObj = Input.createInput(
                {
                    element: this.filterInput,
                    buttons: backIcon ? [searchBackIcon, filterBarClearIcon] : [filterBarClearIcon],
                    properties: { placeholder: this.parent.filterBarPlaceholder }
                },
                this.parent.createElement
            );
            if (!isNullOrUndefined(this.parent.cssClass)) {
                if (this.parent.cssClass.split(' ').indexOf('e-outline') !== -1) {
                    addClass([this.filterInputObj.container], 'e-outline');
                } else if (this.parent.cssClass.split(' ').indexOf('e-filled') !== -1) {
                    addClass([this.filterInputObj.container], 'e-filled');
                }
            }
            append([this.filterInputObj.container], this.parent.filterParent);
            prepend([this.parent.filterParent], args.popupElement);
            attributes(this.filterInput, {
                'aria-disabled': 'false',
                'aria-owns': this.parent.element.id + '_options',
                'role': 'listbox',
                'aria-activedescendant': null,
                'autocomplete': 'off',
                'autocorrect': 'off',
                'autocapitalize': 'off',
                'spellcheck': 'false'
            });
            this.clearIconElement = this.filterInput.parentElement.querySelector('.' + clearIcon);
            if (!Browser.isDevice && this.clearIconElement) {
                EventHandler.add(this.clearIconElement, 'mousedown', this.clearText, this);
                (this.clearIconElement as HTMLElement).style.visibility = 'hidden';
            }
            EventHandler.add(this.filterInput, 'input', this.parent.onInput, this.parent);
            EventHandler.add(this.filterInput, 'keyup', this.parent.keyUp, this.parent);
            EventHandler.add(this.filterInput, 'keydown', this.parent.onKeyDown, this.parent);
            EventHandler.add(this.filterInput, 'blur', this.onBlurHandler, this);
            EventHandler.add(this.filterInput, 'paste', this.parent.pasteHandler, this.parent);
            this.parent.searchBoxHeight = (this.filterInputObj.container.parentElement).getBoundingClientRect().height;
            return this.filterInputObj;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private clickOnBackIcon(e: EventHandler): void {
        this.parent.hidePopup();
        removeClass([document.body, this.parent.popupObj.element], popupFullScreen);
        this.parent.inputElement.focus();
    }
    private clearText(e: MouseEvent): void {
        (this.parent.targetInputElement as HTMLInputElement).value = '';
        if (this.parent.allowFiltering && (this.parent.targetInputElement as HTMLInputElement).value === '') {
            this.parent.search(null);
        }
        this.parent.refreshPopup();
        this.parent.refreshListItems(null);
        (this.clearIconElement as HTMLElement).style.visibility = 'hidden';
        this.filterInput.focus();
        this.setReorder(e);
        e.preventDefault();
    }

    private setDeviceSearchBox(): void {
        this.parent.popupObj.element.classList.add(device);
        this.parent.popupObj.element.classList.add(mobileFilter);
        this.parent.popupObj.position = { X: 0, Y: 0 };
        this.parent.popupObj.dataBind();
        this.setSearchBoxPosition();
        this.backIconElement = this.filterInputObj.container.querySelector('.e-back-icon');
        this.clearIconElement = this.filterInputObj.container.querySelector('.' + clearIcon);
        (this.clearIconElement as HTMLElement).style.visibility = 'hidden';
        EventHandler.add(this.backIconElement, 'click', this.clickOnBackIcon, this);
        EventHandler.add(this.clearIconElement, 'click', this.clearText, this);
    }

    private setSearchBoxPosition(): void {
        const searchBoxHeight: number = this.filterInput.parentElement.getBoundingClientRect().height;
        let selectAllHeight: number = 0;
        if (this.checkAllParent) {
            selectAllHeight = this.checkAllParent.getBoundingClientRect().height;
        }
        this.parent.popupObj.element.style.maxHeight = '100%';
        this.parent.popupObj.element.style.width = '100%';
        this.parent.list.style.maxHeight = (window.innerHeight - searchBoxHeight - selectAllHeight) + 'px';
        this.parent.list.style.height = (window.innerHeight - searchBoxHeight - selectAllHeight) + 'px';
        const clearElement: Element = this.filterInput.parentElement.querySelector('.' + clearIcon);
        detach(this.filterInput);
        clearElement.parentElement.insertBefore(this.filterInput, clearElement);
    }

    protected setPopupFullScreen(): void {
        attributes(this.parent.popupObj.element, { style: 'left:0px;right:0px;top:0px;bottom:0px;' });
        addClass([document.body, this.parent.popupObj.element], popupFullScreen);
        this.parent.popupObj.element.style.maxHeight = '100%';
        this.parent.popupObj.element.style.width = '100%';
    }

    protected targetElement(): string {
        if (!isNullOrUndefined(this.clearIconElement)) {
            this.parent.targetInputElement = this.filterInput;
            (this.clearIconElement as HTMLElement).style.visibility = this.parent.targetInputElement.value === '' ? 'hidden' : 'visible';
        }
        return (this.parent.targetInputElement as HTMLInputElement).value;
    }

    private onBlurHandler(e: MouseEvent): void {
        if (!this.parent.element.classList.contains('e-listbox')) {
            let target: HTMLElement;
            if (this.parent.keyAction) {
                return;
            }
            if (Browser.isIE) {
                target = !isNullOrUndefined(e) && <HTMLElement>e.target;
            }
            if (!Browser.isIE) {
                target = !isNullOrUndefined(e) && <HTMLElement>e.relatedTarget;
            }
            // eslint-disable-next-line max-len
            if (this.parent.popupObj && document.body.contains(this.parent.popupObj.element) && this.parent.popupObj.element.contains(target)
                && !Browser.isIE && this.filterInput) {
                this.filterInput.focus();
                return;
            }
            if (this.parent.scrollFocusStatus && this.filterInput) {
                e.preventDefault();
                this.filterInput.focus();
                this.parent.scrollFocusStatus = false;
                return;
            }
            if (this.parent.popupObj && document.body.contains(this.parent.popupObj.element)
            && !this.parent.popupObj.element.classList.contains('e-popup-close')) {
                this.parent.inputFocus = false;
                this.parent.updateValueState(e, this.parent.value, this.parent.tempValues);
                this.parent.dispatchEvent(this.parent.hiddenElement as HTMLElement, 'change');
            }
            if (this.parent.popupObj && document.body.contains(this.parent.popupObj.element) &&
            !this.parent.popupObj.element.classList.contains('e-popup-close')) {
                this.parent.inputFocus = false;
                this.parent.overAllWrapper.classList.remove(FOCUS);
                this.parent.trigger('blur');
                this.parent.focused = true;
            }
            if (this.parent.popupObj && document.body.contains(this.parent.popupObj.element) &&
                !this.parent.popupObj.element.classList.contains('e-popup-close') && !Browser.isDevice) {
                this.parent.hidePopup();
            }
        }
    }
    protected onDocumentClick(e: MouseEvent): void {
        if (this.parent.getLocaleName() !== 'listbox') {
            const target: HTMLElement = <HTMLElement>e.target;
            if (!isNullOrUndefined(this.parent.popupObj) && closest(target, '[id="' + this.parent.popupObj.element.id + '"]')) {
                if (!(this.filterInput && this.filterInput.value !== '')) {
                    e.preventDefault();
                }
            }
            if (!(!isNullOrUndefined(this.parent.popupObj) && closest(target, '[id="' + this.parent.popupObj.element.id + '"]')) &&
            !this.parent.overAllWrapper.contains(e.target as Node)) {
                if (this.parent.overAllWrapper.classList.contains(dropDownBaseClasses.focus) || this.parent.isPopupOpen()) {
                    this.parent.inputFocus = false;
                    this.parent.scrollFocusStatus = false;
                    this.parent.hidePopup();
                    this.parent.onBlurHandler(e, true);
                    this.parent.focused = true;
                }
            } else {
                this.parent.scrollFocusStatus = (Browser.isIE || Browser.info.name === 'edge') &&
                (document.activeElement === this.filterInput);
            }
            if (!this.parent.overAllWrapper.contains(e.target as Node) && this.parent.overAllWrapper.classList.contains('e-input-focus') &&
            !this.parent.isPopupOpen()) {
                if (Browser.isIE) {
                    this.parent.onBlurHandler();
                } else {
                    this.parent.onBlurHandler(e);
                }
            }
            if (this.filterInput === target) {
                this.filterInput.focus();
            }
        }
    }
    private getFocus(e: IUpdateListArgs): void {
        this.parent.overAllWrapper.classList.remove(FOCUS);
        if (this.parent.keyAction && e.value !== 'clear' && e.value !== 'focus') {
            this.parent.keyAction = false;
            return;
        }
        if (e.value === 'focus') {
            this.filterInput.focus();
            this.parent.removeFocus();
            EventHandler.remove(this.parent.list, 'keydown', this.parent.onKeyDown);
        }
        if (e.value === 'clear') {
            this.filterInput.value = '';
            (this.clearIconElement as HTMLElement).style.visibility = 'hidden';
        }
    }
    private checkSelectAll(e: IUpdateListArgs): void {
        if (e.value === 'check' && this.checkAllParent.getAttribute('aria-checked') !== 'true') {
            this.changeState(this.checkAllParent, e.value, null, null, false);
            this.setLocale(true);
        }
        if (e.value === 'uncheck') {
            this.changeState(this.checkAllParent, e.value, null, null, false);
            this.setLocale();
        }
        if (e.value === 'indeterminate') {
            this.changeState(this.checkAllParent, e.value, null, null, false);
            this.setLocale();
        }
    }
    private setLocale(unSelect?: boolean): void {
        if (this.parent.selectAllText !== 'Select All' || this.parent.unSelectAllText !== 'Unselect All') {
            const template: string = unSelect ? this.parent.unSelectAllText : this.parent.selectAllText;
            this.selectAllSpan.textContent = '';
            const compiledString: Function = compile(template);
            const templateName: string = unSelect ? 'unSelectAllText' : 'selectAllText';
            for (const item of compiledString({}, this.parent, templateName, null, !this.parent.isStringTemplate)) {
                this.selectAllSpan.textContent = item.textContent;
            }
        } else {
            const l10nLocale: Object = { selectAllText: 'Select All', unSelectAllText: 'Unselect All' };
            let l10n: L10n = new L10n(this.parent.getLocaleName(), {}, this.parent.locale);
            if (l10n.getConstant('selectAllText') === '') {
                l10n = new L10n('dropdowns', l10nLocale, this.parent.locale);
            }
            this.selectAllSpan.textContent = unSelect ? l10n.getConstant('unSelectAllText') : l10n.getConstant('selectAllText');
        }
    }
    private getActiveList(args: IUpdateListArgs): void {
        if (args.li.classList.contains('e-active')) {
            this.activeLi.push(args.li.cloneNode(true) as HTMLElement);
        } else {
            this.activeLi.splice(args.index, 1);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private setReorder(args: IUpdateListArgs | MouseEvent): void {
        if (this.parent.enableSelectionOrder && !isNullOrUndefined(this.parent.value)) {
            const activeLiCount: number = this.parent.ulElement.querySelectorAll('li.e-active').length;
            let remLi: NodeListOf<Element>;
            const ulEle: HTMLElement = this.parent.createElement('ul', {
                className: 'e-list-parent e-ul e-reorder'
            });
            if (activeLiCount > 0) {
                append(this.parent.ulElement.querySelectorAll('li.e-active'), ulEle);
                remLi = this.parent.ulElement.querySelectorAll('li.e-active');
                addClass(remLi, 'e-reorder-hide');
                prepend([ulEle], this.parent.list);
            }
            this.parent.focusAtFirstListItem();
        }
    }
}

export interface ItemCreatedArgs {
    curData: { [key: string]: Object }
    item: HTMLElement
    text: string
}

export interface IUpdateListArgs {
    module: string
    enable: boolean
    li: HTMLElement
    e: MouseEvent | KeyboardEventArgs
    popupElement: HTMLElement
    value: string
    index: number
}
