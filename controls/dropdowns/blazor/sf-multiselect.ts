import { BlazorDotnetObject, Browser, Animation, select, remove } from '@syncfusion/ej2-base';
import { formatUnit, attributes, EventHandler, isNullOrUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
import { AnimationModel, closest, setStyleAttribute, createElement, prepend } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';

const POPUP_CONTENT: string = 'e-content';
const LIST_ITEM: string = 'e-list-item';
const CLOSE_POPUP: string = 'ClosePopup';
const ITEM_FOCUS: string = 'e-item-focus';
const SELECTED: string = 'e-active';
const HIDE: string = 'Hide';
const ICON_ANIM: string = 'e-icon-anim';
const DDL_DEVICE: string = 'e-ddl-device';
const MOBILE_FILTER: string = 'e-ddl-device-filter';
const POPUP_FULL_SCREEN: string = 'e-popup-full-page';
const FIXED_HEAD: string = 'e-fixed-head';
const GROUP: string = 'e-list-group-item';
const GROUP_CHECKBOX: string = 'e-multiselect-group';
const INPUT_FOCUS: string = 'e-input-focus';
const REMAIN_WRAPPER: string = 'e-remain';
const DROP_DOWN_ICON: string = 'e-input-group-icon e-ddl-icon';
const CLEAR_ICON: string = 'e-clear-icon';
const TOTAL_COUNT_WRAPPER: string = 'e-delim-total';
const DELIM_HIDE: string = 'e-delim-hide';
const VIRTUAL_HANDLER: string = 'VirtualScrollHandler';
const DDL_HEADER: string = 'e-ddl-header';
const DDL_FOOTER: string = 'e-ddl-footer';
const SELECT_ALL_PARENT: string = 'e-selectall-parent';
const INPUT: string = 'e-input';
const BLURHANDLER: string = 'InvokeBlur';
const BLUR: string = 'blur';
class SfMultiSelect {
    public element: BlazorMultiSelectElement | HTMLInputElement;
    private containerElement: HTMLElement;
    private childContainerElement: HTMLElement;
    public dotNetRef: BlazorDotnetObject;
    public options: IMultiSelectOptions;
    private popupObj: Popup;
    private popupContainer: HTMLElement;
    private list: HTMLElement;
    private popupHolder: HTMLElement;
    private liCollections: Element[];
    private filterInput: HTMLInputElement;
    protected fixedHeaderElement: HTMLElement;
    private viewContainer: HTMLElement;
    private dropIconEle: HTMLElement;
    private clearIconEle: HTMLElement;
    public isDisposed: boolean;

    // tslint:disable
    constructor(containerElement: HTMLElement, childContainerElement: HTMLElement, element: BlazorMultiSelectElement, dotnetRef: BlazorDotnetObject, options: IMultiSelectOptions) {
        this.containerElement = containerElement;
        this.childContainerElement = childContainerElement;
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.isDisposed = false; 
    }
    public initialize(): void {
        EventHandler.add(<HTMLElement & Window>window, 'resize', this.windowResize, this);
        EventHandler.add(this.element, BLUR, this.blurHandler, this);
    }
    private blurHandler(): void {
        if (!this.isDisposed) {
            this.dotNetRef.invokeMethodAsync(BLURHANDLER);
        }
    }
    private getPopupHeight(listHeight: string, searchBoxHeight: number, tempEle: HTMLElement): string {
        let height: number = Math.round(tempEle.getBoundingClientRect().height);
        return (parseInt(listHeight, 10) - (height + searchBoxHeight)).toString() + 'px';
    }
    // tslint:disable
    public renderPopup(popupElement: HTMLElement, popupHolderEle: HTMLElement, openEventArgs: PopupObjectArgs, options: IMultiSelectOptions, dataItem: any): void {
        this.options = options;
        this.popupHolder = popupHolderEle;
        this.list = popupHolderEle.querySelector('.' + POPUP_CONTENT) || select('.' + POPUP_CONTENT);
        this.liCollections = this.getItems();
        let listHeight: string = formatUnit(this.options.popupHeight);
        document.body.appendChild(popupElement);
        popupElement.style.visibility = 'hidden';
        let searchBoxContainer: HTMLElement;
        if (this.options.allowFiltering && this.options.mode === 'CheckBox') {
            this.filterInput = popupElement.querySelector('input.' + INPUT);
            searchBoxContainer = this.filterInput.parentElement;
            EventHandler.add(this.filterInput, 'keypress', this.filterKeydown, this);
        } else {
            this.filterInput = this.element as HTMLInputElement;
        }
        if (this.options.popupHeight !== 'auto') {
            let searchBoxHeight: number = 0;

            if (!isNullOrUndefined(searchBoxContainer)) {
                searchBoxHeight = searchBoxContainer.parentElement.getBoundingClientRect().height;
                listHeight = (parseInt(listHeight, 10) - searchBoxHeight).toString() + 'px';
            }
            let selectAllHeight: number = 0;
            let selectAllElement: HTMLElement = popupElement.querySelector('.' + SELECT_ALL_PARENT);
            if (selectAllElement) {
                selectAllHeight = selectAllElement.getBoundingClientRect().height;
                listHeight = (parseInt(listHeight, 10) - selectAllHeight).toString() + 'px';
            }
            if (popupElement.querySelector('.' + DDL_HEADER)) {
                let header: HTMLElement = popupElement.querySelector('.' + DDL_HEADER);
                listHeight = this.getPopupHeight(listHeight, searchBoxHeight, header);
            }

            if (popupElement.querySelector('.' + DDL_FOOTER)) {
                let footer: HTMLElement = popupElement.querySelector('.' + DDL_FOOTER);
                listHeight = this.getPopupHeight(listHeight, searchBoxHeight, footer);
            }

            this.list.style.maxHeight = (parseInt(listHeight, 10) - 2).toString() + 'px'; // due to box-sizing property

            popupElement.style.maxHeight = formatUnit(this.options.popupHeight);
        } else {
            popupElement.style.height = 'auto';
        }
        this.popupCreation(popupElement);
        if (Browser.isDevice && this.options.mode === 'CheckBox' && this.options.allowFiltering) {
            this.popupObj.element.classList.add(DDL_DEVICE);
                this.popupObj.element.classList.add(MOBILE_FILTER);
                this.popupObj.position = { X: 0, Y: 0 };
                this.popupObj.dataBind();
                attributes(this.popupObj.element, { style: 'left:0px;right:0px;top:0px;bottom:0px;' });
                addClass([document.body, this.popupObj.element], POPUP_FULL_SCREEN);
                this.setSearchBoxPosition();
        }
        popupElement.style.visibility = 'visible';
        addClass([popupElement], 'e-popup-close');
        attributes(this.element, {
            'aria-expanded': 'true'
        });
        if (this.options.enableVirtualization) {
            EventHandler.add(this.list, 'scroll', this.virtualScroll, this);
        }
        let animModel: AnimationModel = {
            name: 'FadeIn',
            duration: 100
        };
        this.popupObj.show(new Animation(animModel), this.options.zIndex === 1000 ? this.element : null);
    }
    private setSearchBoxPosition(): void {
        let searchBoxHeight: number = this.filterInput.parentElement.getBoundingClientRect().height;
        this.popupObj.element.style.maxHeight = '100%';
        this.popupObj.element.style.width = '100%';
        this.list.style.maxHeight = (window.innerHeight - searchBoxHeight) + 'px';
        this.list.style.height = (window.innerHeight - searchBoxHeight) + 'px';
    }
    private filterKeydown(e: KeyboardEvent): void {
        if (this.filterInput.value === "" && e.keyCode === 32 && this.list.querySelector('.' + ITEM_FOCUS)) {
            e.preventDefault();
        }
    }
    private setWidth(): string {
        let width: string = formatUnit(this.options.popupWidth);
        if (width.indexOf('%') > -1) {
            let inputWidth: number = this.containerElement.offsetWidth * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    }
    private popupCreation(popupElement: HTMLElement): void {
        this.popupContainer = popupElement;
        this.popupObj = new Popup(this.popupContainer, {
            width: this.setWidth(), targetType: 'relative',
            relateTo: this.containerElement, collision: { X: 'flip', Y: 'flip' }, offsetY: 1,
            enableRtl: this.options.enableRtl, position: { X: 'left', Y: 'bottom' },
            zIndex: this.options.zIndex,
            close: () => {
                EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
                removeClass([this.containerElement], ICON_ANIM);
                this.fixedHeaderElement = null;
                this.popupHolder.appendChild(this.popupContainer);
                EventHandler.remove(document, 'mousedown', this.onDocumentClick);
                if (Browser.isDevice && this.isFilterLayout()) {
                    removeClass([document.body, this.popupObj.element], POPUP_FULL_SCREEN);
                    EventHandler.remove(this.list, 'scroll', this.listScroll);
                }
                if (this.options.enableVirtualization) {
                    EventHandler.remove(this.list, 'scroll', this.virtualScroll);
                }
                if (this.popupObj) { this.popupObj.destroy(); }
                if (!isNullOrUndefined(this.isDisposed) && !this.isDisposed) {
                    this.dotNetRef.invokeMethodAsync(CLOSE_POPUP);
                }
                this.popupObj = null;
            },
            open: () => {
                EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
                if (this.options.allowFiltering && this.filterInput) {
                    this.filterInput.focus();
                }
                if (this.list.querySelector('li') && this.list.querySelector('li').classList.contains(GROUP) && !popupElement.classList.contains(GROUP_CHECKBOX)) {
                    EventHandler.add(this.list, 'scroll', this.setFloatingHeader, this);
                }
                this.setScrollPosition();
            },
            targetExitViewport: () => {
                if (!Browser.isDevice && !this.isDisposed) { this.dotNetRef.invokeMethodAsync(HIDE); }
            }
        });
    }
    private virtualScroll(): void {
        if (this.popupObj && this.popupObj.element) {
            let borderWidth: number = parseInt(getComputedStyle(this.popupObj.element).borderWidth, 10);
            borderWidth = borderWidth == 0 ? 1 : borderWidth;
            let isPopupOpen: boolean = this.popupObj.element.classList.contains('e-popup-open');
            if (((this.list.scrollTop + this.list.offsetHeight) + borderWidth >= this.list.scrollHeight) && isPopupOpen && !this.isDisposed) {
                this.dotNetRef.invokeMethodAsync(VIRTUAL_HANDLER);
            }
        }
    }
    protected onDocumentClick(e: MouseEvent): void {
        let target: HTMLElement = <HTMLElement>e.target;
        if (!(!isNullOrUndefined(this.popupObj) && closest(target, '#' + this.popupObj.element.id)) &&
            !this.containerElement.contains(e.target as Node)) {
            if (!this.isDisposed && this.containerElement.classList.contains(INPUT_FOCUS) || this.isPopupOpen()) {
                this.dotNetRef.invokeMethodAsync(HIDE);
            }
        } else if (target !== this.element && !(this.options.allowFiltering && this.options.mode === 'CheckBox' && target === this.filterInput)
            && !(!this.options.allowFiltering && Browser.isDevice && target === this.containerElement.querySelector('.e-ddl-icon'))) {
            e.preventDefault();
        }
    }
    private listScroll(): void {
        this.filterInput.blur();
    }
    private setFloatingHeader(e: Event): void {
        if (isNullOrUndefined(this.fixedHeaderElement)) {
            this.fixedHeaderElement = createElement('div', { className: FIXED_HEAD });
            if (!this.list.querySelector('li').classList.contains(GROUP)) {
                this.fixedHeaderElement.style.display = 'none';
            }
            prepend([this.fixedHeaderElement], this.list);
            this.setFixedHeader();
        }
        this.scrollStop(e);
    }
    private isFilterLayout(): boolean {
        return this.options.mode === 'CheckBox' && this.options.allowFiltering;
    }
    private setFixedHeader(): void {
        this.list.parentElement.style.display = 'block';
        let borderWidth: number = 0;
        if (this.list && this.list.parentElement) {
            borderWidth = parseInt(
                document.defaultView.getComputedStyle(this.list.parentElement, null).getPropertyValue('border-width'), 10
            );
        }
        let liWidth: number = (this.liCollections[0] as HTMLElement).offsetWidth - borderWidth;
        this.fixedHeaderElement.style.width = liWidth.toString() + 'px';
        setStyleAttribute(this.fixedHeaderElement, { zIndex: 10 });
        let firstLi: HTMLElement = this.list.querySelector('.' + GROUP) as HTMLElement;
        this.fixedHeaderElement.innerHTML = firstLi.innerHTML;
    }

    private scrollStop(e: Event): void {
        let target: Element = <Element>e.target;
        let liHeight: number = parseInt(getComputedStyle(this.liCollections[0], null).getPropertyValue('height'), 10);
        let topIndex: number = Math.round(target.scrollTop / liHeight);
        let liCollections: NodeListOf<Element> = <NodeListOf<Element>>this.list.querySelectorAll('li');
        for (let i: number = topIndex; i > -1; i--) {
            if (!isNullOrUndefined(liCollections[i]) && liCollections[i].classList.contains(GROUP)) {
                let currentLi: HTMLElement = liCollections[i] as HTMLElement;
                this.fixedHeaderElement.innerHTML = currentLi.innerHTML;
                this.fixedHeaderElement.style.top = (e.target as Element).scrollTop + 'px';
                this.fixedHeaderElement.style.display = 'block';
                break;
            } else {
                this.fixedHeaderElement.style.display = 'none';
                this.fixedHeaderElement.style.top = 'none';
            }
        }
    }
    public closePopup(closeEventArgs: PopupObjectArgs, options: IMultiSelectOptions): void {
        this.options = options;
        if (this.isPopupOpen() && !closeEventArgs.cancel && this.popupObj) {
            let animModel: AnimationModel = {
                name: 'FadeOut',
                duration: 100,
                delay: 0
            };
            this.popupObj.hide(new Animation(animModel));
        }
    }
    public setScrollPosition(action?: string): void {
        if (!isNullOrUndefined(action) && action !== '') {
            switch (action) {
                case 'PageDown':
                case 'ArrowDown':
                case 'End':
                    this.scrollBottom();
                    break;
                default:
                    this.scrollTop();
                    break;
            }
        } else {
            this.scrollBottom(true);
        }
    }
    private scrollBottom(isInitial?: boolean): void {
        if (this.list && (this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED))) {
            let selectedLI: HTMLElement = this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED);
            let currentOffset: number = this.list.offsetHeight;
            let groupBy: boolean = this.list.querySelector('li').classList.contains(GROUP);
            let nextBottom: number = selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop;
            let nextOffset: number = this.list.scrollTop + nextBottom - currentOffset;
            nextOffset = isInitial ? nextOffset + parseInt(getComputedStyle(this.list).paddingTop, 10) * 2 : nextOffset;
            let boxRange: number = selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop;
            boxRange = groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                boxRange - this.fixedHeaderElement.offsetHeight : boxRange;
            if (nextBottom > currentOffset || !(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = nextOffset;
            }
        }
    }

    private scrollTop(): void {
        if (this.list && (this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED))) {
            let selectedLI: HTMLElement = this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED);
            let nextOffset: number = selectedLI.offsetTop - this.list.scrollTop;
            let groupBy: boolean = this.list.querySelector('li').classList.contains(GROUP);
            nextOffset = groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                nextOffset - this.fixedHeaderElement.offsetHeight : nextOffset;
            let boxRange: number = (selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop);
            if (nextOffset < 0) {
                this.list.scrollTop = this.list.scrollTop + nextOffset;
            } else if (!(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = selectedLI.offsetTop - (groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                    this.fixedHeaderElement.offsetHeight : 0);
            }
        }
    }
    private windowResize() {
        if (this.options.mode !== 'Box' && this.viewContainer) {
            this.updateDelimViews(this.viewContainer, this.options);
        }
    }
    public updateDelimViews(viewElement: HTMLElement, options: IMultiSelectOptions): void {
        this.options = options
        this.viewContainer = viewElement;
        if (this.viewContainer && this.viewContainer.previousElementSibling) {
            this.viewContainer.previousElementSibling.classList.add(DELIM_HIDE);
        }
        let delimValues: string[] = this.options.delimValue;
        if (!isNullOrUndefined(delimValues) && delimValues.length > 0) {
            this.viewContainer.classList.remove(DELIM_HIDE);
        } else {
            this.viewContainer.innerHTML = '';
        }
        this.dropIconEle = this.containerElement.querySelector('.' + DROP_DOWN_ICON);
        this.clearIconEle = this.containerElement.querySelector('.' + CLEAR_ICON);
        this.viewContainer.classList.remove(TOTAL_COUNT_WRAPPER);
        if (delimValues && delimValues.length > 0) {
            let data: string = '';
            let temp: string;
            let tempData: string;
            let tempIndex: number = 1;
            let containerWidth: number;
            let remaining: number;
            let downIconWidth: number = 0;
            let clearIconWidth: number = 0;
            let overAllContainer: number;
            this.viewContainer.innerHTML = '';
            let raminElement: HTMLElement = createElement('span', {
                className: REMAIN_WRAPPER
            });
            raminElement.innerHTML = this.options.overFlowContent;
            this.viewContainer.appendChild(raminElement);
            let remainSize: number = raminElement.offsetWidth;
            remove(raminElement);
            if (this.dropIconEle) {
                downIconWidth = this.dropIconEle.offsetWidth +
                    parseInt(window.getComputedStyle(this.dropIconEle).marginRight, 10);
            }
            if (this.clearIconEle) {
                clearIconWidth = this.clearIconEle.offsetWidth +
                    parseInt(window.getComputedStyle(this.clearIconEle).marginRight, 10);
            }
            if (!isNullOrUndefined(delimValues)) {
                for (let index: number = 0; !isNullOrUndefined(delimValues[index]); index++) {
                    data += (index === 0) ? '' : this.options.delimiterChar + ' ';
                    temp = delimValues[index];
                    data += temp;
                    temp = this.viewContainer.innerHTML;
                    this.viewContainer.innerHTML = data;
                    containerWidth = this.viewContainer.offsetWidth +
                        parseInt(window.getComputedStyle(this.viewContainer).paddingRight, 10);
                    overAllContainer = this.childContainerElement.offsetWidth -
                        parseInt(window.getComputedStyle(this.childContainerElement).paddingLeft, 10) -
                        parseInt(window.getComputedStyle(this.childContainerElement).paddingRight, 10);
                    if ((containerWidth + downIconWidth + clearIconWidth) > overAllContainer) {
                        if (!isNullOrUndefined(tempData) && tempData !== '') {
                            temp = tempData;
                            index = tempIndex + 1;
                        }
                        this.viewContainer.innerHTML = temp;
                        remaining = delimValues.length - index;
                        containerWidth = this.viewContainer.offsetWidth;
                        while (((containerWidth + remainSize + downIconWidth) > overAllContainer) && containerWidth !== 0
                            && this.viewContainer.innerHTML !== '') {
                            let textArr: string[] = this.viewContainer.innerHTML.split(this.options.delimiterChar);
                            let totalLength: number = textArr.length;
                            textArr.pop();
                            let remainTxtLength: number = textArr.length;
                            this.viewContainer.innerHTML = textArr.join(this.options.delimiterChar);
                            if (remainTxtLength !== totalLength && remainTxtLength !== 0) {
                                remaining = remaining - remainTxtLength + totalLength;
                            }
                            if (this.viewContainer.innerHTML === '') {
                                remaining++;
                            }
                            containerWidth = this.viewContainer.offsetWidth;
                        }
                        break;
                    }
                    else if ((containerWidth + remainSize + downIconWidth + clearIconWidth) <= overAllContainer) {
                        tempData = data;
                        tempIndex = index;
                    }
                    else if (index === 0) {
                        tempData = '';
                        tempIndex = -1;
                    }
                }
                if (remaining > 0) {
                    let totalWidth: number = overAllContainer - downIconWidth - clearIconWidth;
                    let remainEle: HTMLElement = this.updateRemainElement(raminElement, this.viewContainer, remaining, totalWidth);
                    this.viewContainer.appendChild(remainEle);
                    this.updateRemainWidth(this.viewContainer, totalWidth);
                }
            }
            else {
                this.viewContainer.innerHTML = '';
                this.viewContainer.style.display = 'none';
            }
        }
    }
    private updateRemainWidth(viewContainer: HTMLElement, totalWidth: number): void {
        if (viewContainer.classList.contains(TOTAL_COUNT_WRAPPER) && totalWidth < (viewContainer.offsetWidth +
            parseInt(window.getComputedStyle(viewContainer).paddingLeft, 10)
            + parseInt(window.getComputedStyle(viewContainer).paddingLeft, 10))) {
            viewContainer.style.width = totalWidth + 'px';
        }
    }
    private updateRemainElement(raminElement: HTMLElement, viewContainer: HTMLElement, remaining: number, totalWidth: number): HTMLElement {
        if (viewContainer.firstChild && viewContainer.firstChild.nodeType === 3 && viewContainer.firstChild.nodeValue === '') {
            viewContainer.removeChild(viewContainer.firstChild);
        }
        raminElement.innerHTML = '';
        let remainTemp: string = this.options.overFlowContent.replace('${count}', remaining.toString());
        let totalTemp: string = this.options.totalCountContent.replace('${count}', remaining.toString());
        raminElement.innerHTML = (viewContainer.firstChild && viewContainer.firstChild.nodeType === 3) ?
            remainTemp : totalTemp;
        if (viewContainer.firstChild && viewContainer.firstChild.nodeType === 3) {
            viewContainer.classList.remove(TOTAL_COUNT_WRAPPER);
        }
        else {
            viewContainer.classList.add(TOTAL_COUNT_WRAPPER);
            this.updateRemainWidth(viewContainer, totalWidth);
        }
        return raminElement;
    }
    private isPopupOpen(): boolean {
        return this.popupObj && document.body.contains(this.popupObj.element);
    }
    private getItems(): Element[] {
        return this.list ? <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll('.' + LIST_ITEM) : [];
    }
    public refreshPopup(): void {
        if (this.isPopupOpen()) {
            this.popupObj.refreshPosition(this.containerElement);
        }
    }
}
// tslint:disable
let MultiSelect: object = {
    initialize(containerElement: HTMLElement, childContainerElement: HTMLElement, element: BlazorMultiSelectElement, dotnetRef: BlazorDotnetObject, options: IMultiSelectOptions): void {
        if (element) {
            new SfMultiSelect(containerElement, childContainerElement, element, dotnetRef, options);
            if (element.blazor__instance) {
                element.blazor__instance.initialize();
            }
        }
    },
    renderPopup(element: BlazorMultiSelectElement, popupElement: HTMLElement, popupHolderEle: HTMLElement, openEventArgs: PopupObjectArgs, options: IMultiSelectOptions, dataItem: any) {
        if (element && element.blazor__instance && popupElement && popupHolderEle) {
            element.blazor__instance.renderPopup(popupElement, popupHolderEle, openEventArgs, options, dataItem);
        }
    },
    closePopup(element: BlazorMultiSelectElement, closeEventArgs: PopupObjectArgs, options: IMultiSelectOptions) {
        if (element && element.blazor__instance) { element.blazor__instance.closePopup(closeEventArgs, options); }
    },
    refreshPopup(element: BlazorMultiSelectElement) {
        if (element && element.blazor__instance) { element.blazor__instance.refreshPopup(); }
    },
    updateScrollPosition(element: BlazorMultiSelectElement, action: string): void {
        if (element && element.blazor__instance) { element.blazor__instance.setScrollPosition(action); }
    },
    getPageCount(popupEle: HTMLElement): number {
        let list: HTMLElement = popupEle && popupEle.querySelector('.e-content');
          if (list) {
            let liHeight: string = list.classList.contains('e-nodata') ? null :
                  getComputedStyle(list.querySelectorAll('.e-list-item:not(.e-hide-listitem)')[0], null).getPropertyValue('height');
              return Math.round(list.getBoundingClientRect().height / parseInt(liHeight, 10));
          }
          return 0;
    },
    updateDelimViews: function updateDelimViews(element: BlazorMultiSelectElement, viewElement: HTMLElement, options: IMultiSelectOptions) {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateDelimViews(viewElement, options);
        }
    },
    destroy(element: BlazorMultiSelectElement, popupElement: HTMLElement, popupHolderEle: HTMLElement, closeEventArgs: PopupObjectArgs, options: IMultiSelectOptions) {
        if (element && element.blazor__instance && popupElement && popupElement instanceof HTMLElement && popupHolderEle) {
            element.blazor__instance.isDisposed = true;
            element.blazor__instance.closePopup(closeEventArgs, options);
        }
    },
    focusIn(inputEle: HTMLInputElement): void {
        inputEle && inputEle.focus();
    },
    focusOut(inputEle: HTMLElement): void {
        inputEle && inputEle.blur();
    }
};

interface BlazorMultiSelectElement extends HTMLElement {
    blazor__instance: SfMultiSelect;
}
export interface PopupObjectArgs {
    cancel?: boolean;
    event?: MouseEvent | KeyboardEvent | Event;
}
interface IMultiSelectOptions {
    enableRtl: boolean;
    zIndex: number;
    width: string;
    popupWidth: string;
    popupHeight: string;
    allowFiltering: boolean;
    moduleName: string;
    enableVirtualization: boolean;
    mode: string;
    delimiterChar: string;
    overFlowContent: string;
    totalCountContent: string;
    delimValue: string[];

}

export default MultiSelect;
