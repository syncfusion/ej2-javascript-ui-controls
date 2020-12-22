import { BlazorDotnetObject, Browser, Animation, select, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { formatUnit, attributes, EventHandler, isNullOrUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
import { AnimationModel, closest, setStyleAttribute, createElement, prepend, remove } from '@syncfusion/ej2-base';
import { Popup, isCollide } from '@syncfusion/ej2-popups';

const POPUP_CONTENT: string = 'e-content';
const LIST_ITEM: string = 'e-list-item';
const CLOSE_POPUP: string = 'ClosePopup';
const ITEM_FOCUS: string = 'e-item-focus';
const DDL_DEVICE: string = 'e-ddl-device';
const MOBILE_FILTER: string = 'e-ddl-device-filter';
const POPUP_FULL_SCREEN: string = 'e-popup-full-page';
const INPUT_FOCUS: string = 'e-input-focus';
const FIXED_HEAD: string = 'e-fixed-head';
const GROUP: string = 'e-list-group-item';
const SELECTED: string = 'e-active';
const HOVER: string = 'e-hover';
const HIDE: string = 'Hide';
const ICON_ANIM: string = 'e-icon-anim';
const VIRTUAL_HANDLER: string = 'VirtualScrollHandler';
class SfDropDownList {
    public element: BlazorDropDownListElement | HTMLInputElement;
    private containerElement: HTMLElement;
    private popupContainer: HTMLElement;
    private list: HTMLElement;
    private popupObj: Popup;
    private popupHolder: HTMLElement;
    private keyConfigure: { [key: string]: string };
    public dotNetRef: BlazorDotnetObject;
    public options: IDropDownListOptions;
    private liCollections: HTMLElement[];
    private activeIndex: number = null;
    private filterInput: HTMLElement;
    protected fixedHeaderElement: HTMLElement;
    private prevSelectPoints: { [key: string]: number } = {};
    public isDisposed: boolean;
    // tslint:disable
    constructor(containerElement: HTMLElement, element: BlazorDropDownListElement, dotnetRef: BlazorDotnetObject, options: IDropDownListOptions) {
        this.containerElement = containerElement;
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
    }
    public initialize(): void {
        this.keyConfigure = {
            tab: 'tab',
            enter: '13',
            escape: '27',
            end: '35',
            home: '36',
            down: '40',
            up: '38',
            pageUp: '33',
            pageDown: '34',
            open: 'alt+40',
            close: 'shift+tab',
            hide: 'alt+38',
            space: '32'
        };
        if (!Browser.isDevice) {
            new KeyboardEvents(this.containerElement, {
                keyAction: this.keyActionHandler.bind(this), keyConfigs: this.keyConfigure, eventName: 'keydown'
            });
        }
        if (this.options.moduleName === 'SfComboBox') {
            EventHandler.add(this.element, 'keydown', this.onFilterDown, this);
        }
    }
    public setAutoFillSelection(currentValue: string): void {
        if (!this.isAndroidAutoFill(currentValue)) {
            this.autoFillSelection(currentValue);
        }
    }
    private onFilterDown(e: KeyboardEventArgs): void {
        if(!(e.keyCode === 13 || e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 9)) {
            this.prevSelectPoints = this.getSelectionPoints();
        }
    }
    private getSelectionPoints(): { [key: string]: number } {
        let input: HTMLInputElement = <HTMLInputElement>this.element;
        return { start: Math.abs(input.selectionStart), end: Math.abs(input.selectionEnd) };
    }
    private autoFillSelection(currentValue: string): void {
        let selection: { [key: string]: number } = this.getSelectionPoints();
        let value: string = (this.element as HTMLInputElement).value.substr(0, selection.start);
        if (value && (value.toLowerCase() === currentValue.substr(0, selection.start).toLowerCase())) {
            var inputValue = value + currentValue.substr(value.length, currentValue.length);
            (this.element as HTMLInputElement).value = inputValue;
            (this.element as HTMLInputElement).setSelectionRange(selection.start, (this.element as HTMLInputElement).value.length);
        } else {
            (this.element as HTMLInputElement).value = currentValue;
            (this.element as HTMLInputElement).setSelectionRange(0, (this.element as HTMLInputElement).value.length);
        }
    };
    private isAndroidAutoFill(value: string): boolean {
        if (Browser.isAndroid) {
            let currentPoints: { [key: string]: number } = this.getSelectionPoints();
            let prevEnd: number = this.prevSelectPoints.end;
            let curEnd: number = currentPoints.end;
            let prevStart: number = this.prevSelectPoints.start;
            let curStart: number = currentPoints.start;
            if (prevEnd !== 0 && ((prevEnd === value.length && prevStart === value.length) ||
                (prevStart > curStart && prevEnd > curEnd) || (prevEnd === curEnd && prevStart === curStart))) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    public removeFillSelection(): void {
        let selection: { [key: string]: number } = this.getSelectionPoints();
        (this.element as HTMLInputElement).setSelectionRange(selection.end, selection.end);
    } 
    private keyActionHandler(e: KeyboardEventArgs): void {
        let keyEventsArgs: object = {
            Action: e.action,
            Key: e.key,
            Events: e,
            Type: e.type
        };
        if (e.action === 'tab' && this.isPopupOpen()) {
            e.preventDefault();
        }
        if (!this.isDisposed) {
            this.dotNetRef.invokeMethodAsync('KeyActionHandler', keyEventsArgs);   
        }
        if (e.action !== 'tab' && e.action !== 'close' && e.action !== 'space' && e.action !== 'enter' && e.action !== 'open'
            && (this.options.moduleName === 'SfDropDownList' || e.action !== 'home' && e.action !== 'end')) {
            e.preventDefault();
        }
    }
    private getOffsetValue(popupEle: HTMLElement): number {
        let popupStyles: CSSStyleDeclaration = getComputedStyle(popupEle);
        let borderTop: number = parseInt(popupStyles.borderTopWidth, 10);
        let borderBottom: number = parseInt(popupStyles.borderBottomWidth, 10);
        return this.setPopupPosition(borderTop + borderBottom);
    }
    private setPopupPosition(border?: number): number {
        let offsetValue: number;
        let popupOffset: number = border;
        let selectedLI: HTMLElement = <HTMLElement>this.list.querySelector('.' + ITEM_FOCUS) || <HTMLElement>this.list.querySelector('.' + SELECTED);
        let firstItem: HTMLElement = this.isEmptyList() ? this.list : this.liCollections[0];
        let lastItem: HTMLElement = this.isEmptyList() ? this.list : this.liCollections[this.getItems().length - 1];
        let liHeight: number = firstItem.getBoundingClientRect().height;
        let listHeight: number = this.list.offsetHeight / 2;
        let height: number = isNullOrUndefined(selectedLI) ? firstItem.offsetTop : selectedLI.offsetTop;
        let lastItemOffsetValue: number = lastItem.offsetTop;
        if (lastItemOffsetValue - listHeight < height && !isNullOrUndefined(this.liCollections) &&
            this.liCollections.length > 0 && !isNullOrUndefined(selectedLI)) {
            let count: number = this.list.offsetHeight / liHeight;
            let paddingBottom: number = parseInt(getComputedStyle(this.list).paddingBottom, 10);
            offsetValue = (count - (this.liCollections.length - this.activeIndex)) * liHeight - popupOffset + paddingBottom;
            this.list.scrollTop = selectedLI.offsetTop;
        } else if (height > listHeight) {
            offsetValue = listHeight - liHeight / 2;
            this.list.scrollTop = height - listHeight + liHeight / 2;
        } else {
            offsetValue = height;
        }
        let inputHeight: number = this.containerElement.offsetHeight;
        offsetValue = offsetValue + liHeight + popupOffset - ((liHeight - inputHeight) / 2);
        return -offsetValue;
    }
    private getItems(): Element[] {
        return this.list ? <HTMLElement[] & NodeListOf<Element>>this.list.querySelectorAll('.' + LIST_ITEM) : [];
    }
    // tslint:disable
    public renderPopup(popupElement: HTMLElement, popupHolderEle: HTMLElement, openEventArgs: PopupObjectArgs, options: IDropDownListOptions, dataItem: any): void {
        this.options = options;
        this.popupHolder = popupHolderEle;
        this.list = popupHolderEle.querySelector('.' + POPUP_CONTENT) as HTMLElement || select('.' + POPUP_CONTENT);
        this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.getItems();
        let offsetValue: number = 0;
        let left: number;
        let listHeight: string = formatUnit(this.options.popupHeight);
        let searchBoxContainer: HTMLElement;
        this.wireListEvents();
        let oldPopupEle: HTMLElement = document.body.querySelector('.e-ddl.e-popup.e-popup-open');
        if (oldPopupEle) {
            remove(oldPopupEle);
        }
        document.body.appendChild(popupElement);
        popupElement.style.visibility = 'hidden';
        if (this.options.allowFiltering) {
            if (this.options.moduleName === 'SfDropDownList') {
                this.filterInput = popupElement.querySelector('input.e-input');
                searchBoxContainer = this.filterInput.parentElement;
                    new KeyboardEvents(this.filterInput, {
                        keyAction: this.keyActionHandler.bind(this),
                        keyConfigs: this.keyConfigure,
                        eventName: 'keydown'
                    });
            } else {
                this.filterInput = this.element;
            }
        } 
        if (this.options.popupHeight !== 'auto') {
            let searchBoxHeight: number = 0;
            if (!isNullOrUndefined(searchBoxContainer)) {
                searchBoxHeight = (searchBoxContainer.parentElement).getBoundingClientRect().height;
                listHeight = (parseInt(listHeight, 10) - (searchBoxHeight)).toString() + 'px';
            }
            if (popupElement.querySelector('.e-ddl-header')) {
                let header: HTMLElement = popupElement.querySelector('.e-ddl-header');
                let height: number = Math.round(header.getBoundingClientRect().height);
                listHeight = (parseInt(listHeight, 10) - (height + searchBoxHeight)).toString() + 'px';
            }
            if (popupElement.querySelector('.e-ddl-footer')) {
                let footer: HTMLElement = popupElement.querySelector('.e-ddl-footer');
                let height: number = Math.round(footer.getBoundingClientRect().height);
                listHeight = (parseInt(listHeight, 10) - (height + searchBoxHeight)).toString() + 'px';
            }
            this.list.style.maxHeight = (parseInt(listHeight, 10) - 2).toString() + 'px'; // due to box-sizing property
            popupElement.style.maxHeight = formatUnit(this.options.popupHeight);
        } else { popupElement.style.height = 'auto'; }
        if (this.list && this.list.querySelector('.' + SELECTED)) {
            this.setScrollPosition();
        }
        if (Browser.isDevice && (!this.options.allowFiltering && (this.options.moduleName === 'SfDropDownList' ||
            (this.options.moduleName === 'SfComboBox')))) {
            offsetValue = this.getOffsetValue(popupElement);
            let firstItem: HTMLElement = this.isEmptyList() ? this.list : this.liCollections[0];
            left = -(parseInt(getComputedStyle(firstItem).textIndent, 10) -
                parseInt(getComputedStyle(this.element).paddingLeft, 10) +
                parseInt(getComputedStyle(this.element.parentElement).borderLeftWidth, 10));
        }
        this.popupCreation(popupElement, offsetValue, left);
        this.checkCollision(popupElement);
        if (Browser.isDevice) {
            this.popupObj.element.classList.add(DDL_DEVICE);
            if (this.options.moduleName === 'SfDropDownList' || (this.options.moduleName === 'SfComboBox'
                && !this.options.allowFiltering)) {
                this.popupObj.collision = { X: 'fit', Y: 'fit' };
            }
            if (this.options.allowFiltering && this.options.moduleName === 'SfDropDownList') {
                this.popupObj.element.classList.add(MOBILE_FILTER);
                this.popupObj.position = { X: 0, Y: 0 };
                this.popupObj.dataBind();
                attributes(this.popupObj.element, { style: 'left:0px;right:0px;top:0px;bottom:0px;' });
                addClass([document.body, this.popupObj.element], POPUP_FULL_SCREEN);
                this.setSearchBoxPosition();
            }
        }
        popupElement.style.visibility = 'visible';
        addClass([popupElement], 'e-popup-close');
        if (Browser.isDevice) {
            if ((this.options.moduleName === 'SfDropDownList' &&
            !this.options.allowFiltering) || (this.options.moduleName === 'SfComboBox' && !this.options.allowFiltering)) {
                let scrollParentElements: HTMLElement[] = this.popupObj.getScrollableParent(this.containerElement);
                for (let element of scrollParentElements) { EventHandler.add(element, 'scroll', this.scrollHandler, this); }
            }
            if (this.isFilterLayout()) { EventHandler.add(this.list, 'scroll', this.listScroll, this); }
        }
        if (this.options.enableVirtualization) {
            EventHandler.add(this.list, 'scroll', this.virtualScroll, this);
        }
        attributes(this.containerElement, { 'aria-expanded': 'true' });
        let inputParent: HTMLElement = this.options.allowFiltering ? this.filterInput.parentElement : this.containerElement;
        addClass([inputParent], [INPUT_FOCUS]);
        let animModel: AnimationModel = { name: 'FadeIn', duration: 100 };
        this.popupObj.show(new Animation(animModel), (this.options.zIndex === 1000) ? this.element : null)
    }
    private wireListEvents(): void {
        EventHandler.add(this.list, 'mouseover', this.onMouseOver, this);
        EventHandler.add(this.list, 'mouseout', this.onMouseLeave, this);
    };
    private unWireListEvents(): void {
        EventHandler.remove(this.list, 'mouseover', this.onMouseOver);
        EventHandler.remove(this.list, 'mouseout', this.onMouseLeave);
    };
    private onMouseOver(e: MouseEvent): void {
        let currentLi: HTMLElement = <HTMLElement>closest(<Element>e.target, '.' + LIST_ITEM);
        this.setHover(currentLi);
    };
    private onMouseLeave(e: MouseEvent): void {
        this.removeHover();
    };
    private listScroll(): void {
        this.filterInput.blur();
    }
    private scrollHandler(): void {
        if (!this.isDisposed) {
            this.dotNetRef.invokeMethodAsync(HIDE);   
        }
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
    private setFixedHeader(): void {
        this.list.parentElement.style.display = 'block';
        let borderWidth: number = 0;
        if (this.list && this.list.parentElement) {
            borderWidth = parseInt(
                document.defaultView.getComputedStyle(this.list.parentElement, null).getPropertyValue('border-width'), 10
            );
        }
        let liWidth: number = this.liCollections[0].offsetWidth - borderWidth;
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
    private isFilterLayout(): boolean {
        return this.options.moduleName === 'SfDropDownList' && this.options.allowFiltering;
    }
    private setSearchBoxPosition(): void {
        let searchBoxHeight: number = this.filterInput.parentElement.getBoundingClientRect().height;
        this.popupObj.element.style.maxHeight = '100%';
        this.popupObj.element.style.width = '100%';
        this.list.style.maxHeight = (window.innerHeight - searchBoxHeight) + 'px';
        this.list.style.height = (window.innerHeight - searchBoxHeight) + 'px';
    }
    private checkCollision(popupEle: HTMLElement): void {
        if (!Browser.isDevice || (Browser.isDevice && !(this.options.moduleName === 'SfDropDownList'))) {
            let collision: string[] = isCollide(popupEle);
            if (collision.length > 0) {
                popupEle.style.marginTop = -parseInt(getComputedStyle(popupEle).marginTop, 10) + 'px';
            }
        }
    }
    public refreshPopup(): void {
        if (this.isPopupOpen()) {
            this.popupObj.refreshPosition(this.containerElement);
        }
    }
    private popupCreation(popupElement: HTMLElement, offsetValue:  number, left: number): void {
        this.popupContainer = popupElement;
        this.popupObj = new Popup(this.popupContainer, {
            width: this.setWidth(), targetType: 'relative',
            relateTo: this.containerElement, collision: { X: 'flip', Y: 'flip' }, offsetY: offsetValue,
            enableRtl: this.options.enableRtl, offsetX: left, position: { X: 'left', Y: 'bottom' },
            zIndex: this.options.zIndex,
            close: () => {
                EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
                removeClass([this.containerElement], ICON_ANIM);
                this.fixedHeaderElement = null;
                this.popupHolder.appendChild(this.popupContainer);
                EventHandler.remove(document, 'mousedown', this.onDocumentClick);
                this.unWireListEvents();
                let scrollableParentElements: HTMLElement[] = this.popupObj.getScrollableParent(this.containerElement);
                for (let element of scrollableParentElements) {
                    EventHandler.remove(element, 'scroll', this.scrollHandler);
                }
                if (Browser.isDevice && this.isFilterLayout()) {
                    removeClass([document.body, this.popupObj.element], POPUP_FULL_SCREEN);
                    EventHandler.remove(this.list, 'scroll', this.listScroll);
                }
                if (this.options.enableVirtualization) {
                    EventHandler.remove(this.list, 'scroll', this.virtualScroll);
                }
                if (this.popupObj) { this.popupObj.destroy(); }
                if (!this.isDisposed && document.body.contains(this.element))
                {
                    this.dotNetRef.invokeMethodAsync(CLOSE_POPUP);
                }
                this.popupObj = null;
            },
            open: () => {
                EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
                if (this.options.allowFiltering && this.filterInput) {
                    this.filterInput.focus();
                }
                if (this.list.querySelector('li') && this.list.querySelector('li').classList.contains(GROUP)) {
                    EventHandler.add(this.list, 'scroll', this.setFloatingHeader, this);
                }
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
    private isEmptyList(): boolean {
        return !isNullOrUndefined(this.liCollections) && this.liCollections.length === 0;
    }
    private setWidth(): string {
        let width: string = formatUnit(this.options.popupWidth);
        if (width.indexOf('%') > -1) {
            let inputWidth: number = this.containerElement.offsetWidth * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        if (Browser.isDevice && (!this.options.allowFiltering)) {
            let firstItem: HTMLElement = this.isEmptyList() ? this.list : this.liCollections[0];
            width = (parseInt(width, 10) + (parseInt(getComputedStyle(firstItem).textIndent, 10) -
                parseInt(getComputedStyle(this.element).paddingLeft, 10) +
                parseInt(getComputedStyle(this.element.parentElement).borderLeftWidth, 10)) * 2) + 'px';
        }
        return width;
    }
    protected onDocumentClick(e: MouseEvent): void {
        let target: HTMLElement = <HTMLElement>e.target;
        if (!(!isNullOrUndefined(this.popupObj) && closest(target, '#' + this.popupObj.element.id)) &&
            !this.containerElement.contains(e.target as Node)) {
            if (this.containerElement.classList.contains(INPUT_FOCUS) || this.isPopupOpen() && !this.isDisposed) {
                this.dotNetRef.invokeMethodAsync(HIDE);
            }
        } else if (target !== this.element && !(this.options.allowFiltering && target === this.filterInput)
            && !(this.options.moduleName === 'SfComboBox' &&
                !this.options.allowFiltering && Browser.isDevice && target === this.containerElement.querySelector('.e-ddl-icon'))) {
            e.preventDefault();
        }
    }
    public closePopup(closeEventArgs: PopupObjectArgs, options: IDropDownListOptions): void {
        this.options = options;
        if (this.isPopupOpen() && !closeEventArgs.cancel && this.popupObj) {
            let animModel: object = {
              name: 'FadeOut',
              duration: 20,
              delay: 0
            };
            this.popupObj.hide(new Animation(animModel));
          }
    }
    public setScrollPosition(e?: KeyboardEventArgs): void {
        if (!isNullOrUndefined(e)) {
            switch (e.action) {
                case 'pageDown':
                case 'down':
                case 'end':
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
            let selectedLI: HTMLElement = (this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED));
            let currentOffset: number = this.list.offsetHeight;
            let groupBy: boolean = this.list.querySelector('li').classList.contains(GROUP);
            let nextBottom: number = selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop;
            let nextOffset: number = this.list.scrollTop + nextBottom - currentOffset;
            nextOffset = isInitial ? nextOffset + parseInt(getComputedStyle(this.list).paddingTop, 10) * 2 : nextOffset;
            let boxRange: number = selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop;
            boxRange = groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                boxRange - this.fixedHeaderElement.offsetHeight : boxRange;
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            } else if (nextBottom > currentOffset || !(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = nextOffset;
            }
        }
    }

    private scrollTop(): void {
        if (this.list && (this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED))) {
            let selectedLI: HTMLElement = (this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED));
            let nextOffset: number = selectedLI.offsetTop - this.list.scrollTop;
            let groupBy: boolean = this.list.querySelector('li').classList.contains(GROUP);
            nextOffset = groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                nextOffset - this.fixedHeaderElement.offsetHeight : nextOffset;
            let boxRange: number = (selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop);
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            } else if (nextOffset < 0) {
                this.list.scrollTop = this.list.scrollTop + nextOffset;
            } else if (!(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = selectedLI.offsetTop - (groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                    this.fixedHeaderElement.offsetHeight : 0);
            }
        }
    }
    private setHover(li: HTMLElement): void {
        if (li && !li.classList.contains(HOVER)) {
            this.removeHover();
            addClass([li], HOVER);
        }
    };
    private removeHover(): void {
        if (this.list) {
            let hoveredItem: Element[] = <NodeListOf<Element> & Element[]>this.list.querySelectorAll('.' + HOVER);
            if (hoveredItem && hoveredItem.length) {
                removeClass(hoveredItem, HOVER);
            }
        }
    }
    private isPopupOpen(): boolean {
        return this.popupObj && document.body.contains(this.popupObj.element);
    }
}
// tslint:disable
let DropDownList: object = {
    initialize(containerElement: HTMLElement, element: BlazorDropDownListElement, dotnetRef: BlazorDotnetObject, options: IDropDownListOptions): void {
        if (element) {
        new SfDropDownList(containerElement, element, dotnetRef, options);
            if (element.blazor__instance) {
                element.blazor__instance.initialize();
            }
        }
    },
    renderPopup(element: BlazorDropDownListElement, popupElement: HTMLElement, popupHolderEle: HTMLElement, openEventArgs: PopupObjectArgs, options: IDropDownListOptions, dataItem: any) {
        if (element && element.blazor__instance && popupElement && popupHolderEle) {
            element.blazor__instance.renderPopup(popupElement, popupHolderEle, openEventArgs, options, dataItem);
        }
    },
    refreshPopup(element: BlazorDropDownListElement) {
        if (element && element.blazor__instance) { element.blazor__instance.refreshPopup(); }
    },
    closePopup(element: BlazorDropDownListElement, closeEventArgs: PopupObjectArgs, options: IDropDownListOptions) {
        if (element && element.blazor__instance) { element.blazor__instance.closePopup(closeEventArgs, options); }
    },
    updateScrollPosition(element: BlazorDropDownListElement, args: KeyboardEventArgs): void {
        if (element && element.blazor__instance) { element.blazor__instance.setScrollPosition(args); }
    },
    getPageCount(popupEle: HTMLElement): number {
        let list: HTMLElement = popupEle && popupEle.querySelector('.e-content');
          if (list) {
            let liHeight: string = list.classList.contains('e-nodata') ? null :
                  getComputedStyle(list.querySelectorAll('.e-list-item')[0], null).getPropertyValue('height');
              return Math.round(list.getBoundingClientRect().height / parseInt(liHeight, 10));
          }
          return 0;
    },
    setAutoFillSelection(element: BlazorDropDownListElement, currentValue: string) {
        if (element && element.blazor__instance) { element.blazor__instance.setAutoFillSelection(currentValue); }
    },
    removeFillSelection(element: BlazorDropDownListElement) {
        if (element && element.blazor__instance) { element.blazor__instance.removeFillSelection(); }
    },
    focusIn(inputEle: HTMLInputElement): void {
        inputEle && inputEle.focus();
    },
    focusOut(inputEle: HTMLElement): void {
        inputEle && inputEle.blur();
    },
    destroy(element: BlazorDropDownListElement, popupElement: HTMLElement, popupHolderEle: HTMLElement, closeEventArgs: PopupObjectArgs, options: IDropDownListOptions) {
        if (element && element.blazor__instance && popupElement && popupElement instanceof HTMLElement && popupHolderEle) {
            element.blazor__instance.isDisposed = true;
            element.blazor__instance.closePopup(closeEventArgs, options);
        }
    },
};

interface BlazorDropDownListElement extends HTMLElement {
    blazor__instance: SfDropDownList;
}
export interface PopupObjectArgs {
    cancel?: boolean;
    event?: MouseEvent | KeyboardEvent | Event;
}
interface IDropDownListOptions {
    enableRtl: boolean;
    zIndex: number;
    width: string;
    popupWidth: string;
    popupHeight: string;
    allowFiltering: boolean;
    moduleName: string;
    enableVirtualization: boolean;
}

export default DropDownList;
