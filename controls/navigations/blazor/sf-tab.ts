import { BlazorDotnetObject, closest, attributes, detach, Instance, formatUnit } from '@syncfusion/ej2-base';
import { KeyboardEvents, KeyboardEventArgs, Effect, Browser, DomElements, select, isVisible } from '@syncfusion/ej2-base';
import { setStyleAttribute as setStyle, isNullOrUndefined as isNOU, selectAll, addClass, removeClass } from '@syncfusion/ej2-base';
import { EventHandler, rippleEffect, Touch, SwipeEventArgs, Animation, AnimationModel, getRandomId } from '@syncfusion/ej2-base';
import { Popup, PopupModel } from '@syncfusion/ej2-popups';
import { HeaderPosition, ContentLoad, TabAnimationSettingsModel, SelectingEventArgs } from '../src/tab';

type HTEle = HTMLElement;

const CLS_TAB: string = 'e-tab';
const CLS_HEADER: string = 'e-tab-header';
const CLS_BLA_TEM: string = 'blazor-template';
const CLS_CONTENT: string = 'e-content';
const CLS_NEST: string = 'e-nested';
const CLS_ITEM: string = 'e-item';
const CLS_RTL: string = 'e-rtl';
const CLS_ACTIVE: string = 'e-active';
const CLS_DISABLE: string = 'e-disable';
const CLS_HIDDEN: string = 'e-hidden';
const CLS_FOCUS: string = 'e-focused';
const CLS_INDICATOR: string = 'e-indicator';
const CLS_WRAP: string = 'e-tab-wrap';
const CLS_TB_ITEMS: string = 'e-toolbar-items';
const CLS_TB_ITEM: string = 'e-toolbar-item';
const CLS_TB_POP: string = 'e-toolbar-pop';
const CLS_TB_POPUP: string = 'e-toolbar-popup';
const CLS_POPUP_OPEN: string = 'e-popup-open';
const CLS_POPUP_CLOSE: string = 'e-popup-close';
const CLS_PROGRESS: string = 'e-progress';
const CLS_IGNORE: string = 'e-ignore';
const CLS_OVERLAY: string = 'e-overlay';
const CLS_HSCRCNT: string = 'e-hscroll-content';
const CLS_VSCRCNT: string = 'e-vscroll-content';
const CLS_VTAB: string = 'e-vertical-tab';
const CLS_HBOTTOM: string = 'e-horizontal-bottom';
const CLS_VERTICAL_ICON: string = 'e-vertical-icon';
const CLS_VLEFT: string = 'e-vertical-left';
const CLS_VRIGHT: string = 'e-vertical-right';
const SPACEBAR: number = 32;
const END: number = 35;

class SfTab {
    private hdrEle: HTEle;
    private cntEle: HTEle;
    public tabId: string;
    private tbItems: HTEle;
    private tbItem: HTEle[];
    private tbPop: HTEle;
    public isPopup: boolean;
    private prevIndex: number;
    private prevItem: HTEle;
    private popEle: DomElements;
    private bdrLine: HTEle;
    private popObj: Popup;
    private show: object = {};
    private hide: object = {};
    private enableAnimation: boolean;
    private keyModule: KeyboardEvents;
    private tabKeyModule: KeyboardEvents;
    private touchModule: Touch;
    private initRender: boolean;
    private prevActiveEle: string;
    private isSwipeed: boolean;
    private scrCntClass: string;
    private resizeContext: EventListenerObject = this.refreshActElePosition.bind(this);
    private keyConfigs: { [key: string]: string } = {
        tab: 'tab',
        home: 'home',
        end: 'end',
        enter: 'enter',
        space: 'space',
        delete: 'delete',
        moveLeft: 'leftarrow',
        moveRight: 'rightarrow',
        moveUp: 'uparrow',
        moveDown: 'downarrow'
    };
    public element: BlazorTabElement;
    public dotNetRef: BlazorDotnetObject;
    public options: ITabOptions;
    constructor(element: BlazorTabElement, options: ITabOptions, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.options = options;
    }
    public render(): void {
        let nested: Element = closest(this.element, '.' + CLS_CONTENT);
        this.prevIndex = 0;
        this.isPopup = false;
        this.initRender = true;
        this.isSwipeed = false;
        if (!isNOU(nested)) {
            nested.parentElement.classList.add(CLS_NEST);
        }
        let name: string = Browser.info.name;
        let css: string = (name === 'msie') ? 'e-ie' : (name === 'edge') ? 'e-edge' : (name === 'safari') ? 'e-safari' : '';
        setStyle(this.element, { 'width': formatUnit(this.options.width), 'height': formatUnit(this.options.height) });
        attributes(this.element, { 'aria-disabled': 'false', 'aria-activedescendant': '' });
        this.setCssClass(this.element, css, true);
        this.updatePopAnimationConfig();
        this.tabId = this.element.id.length > 0 ? ('-' + this.element.id) : getRandomId();
        this.wireEvents();
        this.initRender = false;
    }
    public serverItemsChanged(): void {
        this.enableAnimation = false;
        this.setActive(this.options.selectedItem);
        if (this.options.loadOn !== 'Dynamic' && !isNOU(this.cntEle)) {
            let itemCollection: HTMLElement[] = [].slice.call(this.cntEle.children);
            let content: string = CLS_CONTENT + this.tabId + '_' + this.options.selectedItem;
            itemCollection.forEach((item: HTEle) => {
                if (item.classList.contains(CLS_ACTIVE) && item.id !== content) {
                    item.classList.remove(CLS_ACTIVE);
                }
                if (item.id === content) {
                    item.classList.add(CLS_ACTIVE);
                }
            });
            this.prevIndex = this.options.selectedItem;
            this.triggerAnimation(CLS_ITEM + this.tabId + '_' + this.options.selectedItem, false);
        }
        this.enableAnimation = true;
    }
    public headerReady(): void {
        this.initRender = true;
        this.hdrEle = this.getTabHeader();
        this.setOrientation(this.options.headerPlacement, this.hdrEle);
        this.tbItems = <HTEle>select('.' + CLS_HEADER + ' .' + CLS_TB_ITEMS, this.element);
        if (!isNOU(this.tbItems)) {
            rippleEffect(this.tbItems, { selector: '.e-tab-wrap' });
        }
        if (selectAll('.' + CLS_TB_ITEM, this.element).length > 0) {
            let scrollCnt: HTEle;
            this.bdrLine = <HTEle>select('.' + CLS_INDICATOR + '.' + CLS_IGNORE, this.element);
            scrollCnt = <HTEle>select('.' + this.scrCntClass, this.tbItems);
            if (!isNOU(scrollCnt)) {
                scrollCnt.insertBefore(this.bdrLine, scrollCnt.firstElementChild);
            } else {
                this.tbItems.insertBefore(this.bdrLine, this.tbItems.firstElementChild);
            }
            this.select(this.options.selectedItem);
        }
        this.cntEle = <HTEle>select('.' + CLS_TAB + ' > .' + CLS_CONTENT, this.element);
        if (!isNOU(this.cntEle)) { this.touchModule = new Touch(this.cntEle, { swipe: this.swipeHandler.bind(this) }); }
        if (this.options.loadOn === 'Demand') {
            let id: string = this.setActiveContent();
            this.triggerAnimation(id, false);
        }
        this.initRender = false;
    }
    private setActiveContent(): string {
        let id: string = CLS_ITEM + this.tabId + '_' + this.options.selectedItem;
        let item: HTEle = this.getTrgContent(this.cntEle, this.extIndex(id));
        if (!isNOU(item)) {
            item.classList.add(CLS_ACTIVE);
        }
        return id;
    }
    private removeActiveClass(): void {
        let tabHeader: HTMLElement = this.getTabHeader();
        if (tabHeader) {
            let tabItems: HTMLElement[] = selectAll('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE, tabHeader);
            removeClass(tabItems, CLS_ACTIVE);
        }
    }
    private checkPopupOverflow(ele: HTEle): boolean {
        this.tbPop = <HTEle>select('.' + CLS_TB_POP, this.element);
        let popIcon: HTEle = (<HTEle>select('.e-hor-nav', this.element));
        let tbrItems: HTEle = (<HTEle>select('.' + CLS_TB_ITEMS, this.element));
        let lastChild: HTEle = <HTMLElement>tbrItems.lastChild;
        if ((!this.isVertical() && ((this.options.enableRtl && ((popIcon.offsetLeft + popIcon.offsetWidth) > tbrItems.offsetLeft))
            || (!this.options.enableRtl && popIcon.offsetLeft < tbrItems.offsetWidth))) ||
            (this.isVertical() && (popIcon.offsetTop < lastChild.offsetTop + lastChild.offsetHeight))) {
            ele.classList.add(CLS_TB_POPUP);
            this.tbPop.insertBefore(<Node>ele, selectAll('.' + CLS_TB_POPUP, this.tbPop)[0]);
        }
        return true;
    }
    private popupHandler(target: HTEle): number {
        let ripEle: HTEle = <HTEle>target.querySelector('.e-ripple-element');
        if (!isNOU(ripEle)) {
            ripEle.outerHTML = '';
            target.querySelector('.' + CLS_WRAP).classList.remove('e-ripple');
        }
        this.tbItem = selectAll('.' + CLS_TB_ITEMS + ' .' + CLS_TB_ITEM, this.hdrEle);
        let lastChild: HTEle = <HTEle>this.tbItem[this.tbItem.length - 1];
        if (this.tbItem.length !== 0) {
            target.classList.remove(CLS_TB_POPUP);
            target.removeAttribute('style');
            this.tbItems.appendChild(target);
            if (this.checkPopupOverflow(lastChild)) {
                let prevEle: HTEle = <HTEle>(<HTEle>this.tbItems.lastChild).previousElementSibling;
                this.checkPopupOverflow(prevEle);
            }
            this.isPopup = true;
        }
        return selectAll('.' + CLS_TB_ITEM, this.tbItems).length - 1;
    }
    private previousContentAnimation(prev: number, current: number): AnimationModel {
        let animation: AnimationModel;
        if (this.isPopup || prev <= current) {
            if (this.options.animation.previous.effect === 'SlideLeftIn') {
                animation = {
                    name: 'SlideLeftOut',
                    duration: this.options.animation.previous.duration, timingFunction: this.options.animation.previous.easing
                };
            } else {
                animation = null;
            }
        } else {
            if (this.options.animation.next.effect === 'SlideRightIn') {
                animation = {
                    name: 'SlideRightOut',
                    duration: this.options.animation.next.duration, timingFunction: this.options.animation.next.easing
                };
            } else { animation = null; }
        }
        return animation;
    }
    private triggerPreviousAnimation(oldCnt: HTEle, prevIndex: number): void {
        let animateObj: AnimationModel = this.previousContentAnimation(prevIndex, this.options.selectedItem);
        if (!isNOU(animateObj)) {
            animateObj.begin = () => {
                setStyle(oldCnt, { 'position': 'absolute' });
                addClass([oldCnt], [CLS_PROGRESS, 'e-view']);
            };
            animateObj.end = () => {
                oldCnt.style.display = 'none';
                removeClass([oldCnt], [CLS_ACTIVE, CLS_PROGRESS, 'e-view']);
                setStyle(oldCnt, { 'display': '', 'position': '' });
                if (oldCnt.childNodes.length === 0) {
                    detach(oldCnt);
                }
            };
            new Animation(animateObj).animate(oldCnt);
        } else {
            oldCnt.classList.remove(CLS_ACTIVE);
        }
    }
    private triggerAnimation(id: string, value: boolean): void {
        let prevIndex: number = this.prevIndex;
        let oldCnt: HTEle;
        let newCnt: HTEle;
        if (this.options.loadOn !== 'Dynamic') {
            let itemCollection: HTMLElement[] = [].slice.call(this.element.querySelector('.' + CLS_CONTENT).children);
            itemCollection.forEach((item: HTEle) => {
                if (item.id === this.prevActiveEle) {
                    oldCnt = item;
                }
            });
            let prevEle: HTEle = this.tbItem[prevIndex];
            newCnt = this.getTrgContent(this.cntEle, this.extIndex(id));
            if (isNOU(oldCnt) && !isNOU(prevEle)) {
                let idNo: string = this.extIndex(prevEle.id);
                oldCnt = this.getTrgContent(this.cntEle, idNo);
            }
        } else {
            newCnt = this.cntEle.firstElementChild as HTMLElement;
        }
        if (!isNOU(newCnt)) {
            this.prevActiveEle = newCnt.id;
        }
        if (this.initRender || value === false || this.options.animation === {} || isNOU(this.options.animation)) {
            if (oldCnt && oldCnt !== newCnt) { oldCnt.classList.remove(CLS_ACTIVE); }
            return;
        }
        let cnt: HTEle = <HTEle>select('.' + CLS_CONTENT, this.element);
        let animateObj: AnimationModel;
        if (this.prevIndex > this.options.selectedItem && !this.isPopup) {
            let openEff: Effect = <Effect>this.options.animation.previous.effect;
            animateObj = {
                name: <Effect>((openEff === <Effect>'None') ? '' : ((openEff !== <Effect>'SlideLeftIn') ? openEff : 'SlideLeftIn')),
                duration: this.options.animation.previous.duration,
                timingFunction: this.options.animation.previous.easing
            };
        } else if (this.isPopup || this.prevIndex < this.options.selectedItem || this.prevIndex === this.options.selectedItem) {
            let clsEff: Effect = <Effect>this.options.animation.next.effect;
            animateObj = {
                name: <Effect>((clsEff === <Effect>'None') ? '' : ((clsEff !== <Effect>'SlideRightIn') ? clsEff : 'SlideRightIn')),
                duration: this.options.animation.next.duration,
                timingFunction: this.options.animation.next.easing
            };
        }
        animateObj.progress = () => {
            cnt.classList.add(CLS_PROGRESS); this.setActiveBorder();
        };
        animateObj.end = () => {
            cnt.classList.remove(CLS_PROGRESS);
            newCnt.classList.add(CLS_ACTIVE);
        };
        if (!this.initRender && !isNOU(oldCnt)) {
            this.triggerPreviousAnimation(oldCnt, prevIndex);
        }
        this.isPopup = false;
        if (animateObj.name === <Effect>'') {
            newCnt.classList.add(CLS_ACTIVE);
        } else {
            new Animation(animateObj).animate(newCnt);
        }
    }
    private keyPressed(trg: HTEle): void {
        let trgParent: HTEle = <HTEle>closest(trg, '.' + CLS_HEADER + ' .' + CLS_TB_ITEM);
        let trgIndex: number = this.getEleIndex(trgParent);
        if (!isNOU(this.popEle) && trg.classList.contains('e-hor-nav')) {
            (this.popEle.classList.contains(CLS_POPUP_OPEN)) ? this.popObj.hide(this.hide) : this.popObj.show(this.show);
        } else if (trg.classList.contains('e-scroll-nav')) {
            trg.click();
        } else {
            if (!isNOU(trgParent) && trgParent.classList.contains(CLS_ACTIVE) === false) {
                this.select(trgIndex);
                if (!isNOU(this.popEle)) {
                    this.popObj.hide(this.hide);
                }
            }
        }
    }
    private getTabHeader(): HTMLElement {
        let headers: HTMLElement[] = [].slice.call(this.element.children).filter((e: HTMLElement) => e.classList.contains(CLS_HEADER));
        if (headers.length > 0) {
            return headers[0];
        } else {
            let wrap: HTMLElement = [].slice.call(this.element.children).filter((e: HTMLElement) => !e.classList.contains(CLS_BLA_TEM))[0];
            if (!wrap) {
                return undefined;
            }
            return [].slice.call(wrap.children).filter((e: HTMLElement) => e.classList.contains(CLS_HEADER))[0];
        }
    }
    private getEleIndex(item: HTEle): number {
        return Array.prototype.indexOf.call(selectAll('.' + CLS_TB_ITEM, this.getTabHeader()), item);
    }
    private extIndex(id: string): string {
        return id.replace(CLS_ITEM + this.tabId + '_', '');
    }
    private getTrgContent(cntEle: HTEle, no: string): HTEle {
        let ele: HTEle;
        if (this.element.classList.contains(CLS_NEST)) {
            ele = <HTEle>select('.' + CLS_NEST + '> .' + CLS_CONTENT + ' > #' + CLS_CONTENT + this.tabId + '_' + no, this.element);
        } else { ele = this.findEle(cntEle.children, CLS_CONTENT + this.tabId + '_' + no); }
        return ele;
    }
    private findEle(items: HTMLCollection, key: string): HTEle {
        let ele: HTEle;
        for (let i: number = 0; i < items.length; i++) {
            if (items[i].id === key) { ele = <HTEle>items[i]; break; }
        }
        return ele;
    }
    private isVertical(): boolean {
        let isVertical: boolean = (this.options.headerPlacement === 'Left' || this.options.headerPlacement === 'Right') ? true : false;
        this.scrCntClass = (isVertical) ? CLS_VSCRCNT : CLS_HSCRCNT;
        return isVertical;
    }
    private updatePopAnimationConfig(): void {
        this.show = { name: (this.isVertical() ? 'FadeIn' : 'SlideDown'), duration: 100 };
        this.hide = { name: (this.isVertical() ? 'FadeOut' : 'SlideUp'), duration: 100 };
    }
    private focusItem(): void {
        let curActItem: HTEle = <HTEle>select(' #' + CLS_ITEM + this.tabId + '_' + this.options.selectedItem, this.hdrEle);
        if (!isNOU(curActItem)) {
            (<HTEle>curActItem.firstElementChild).focus();
        }
    }
    public serverChangeOrientation(newProp: HeaderPosition, tbarEle: BlazorToolbarElement, isVertical: boolean, isChange: boolean): void {
        this.setOrientation(newProp, this.hdrEle);
        removeClass([this.element], [CLS_VTAB, CLS_VLEFT, CLS_VRIGHT]);
        if (isChange) {
            this.changeToolbarOrientation(tbarEle, isVertical);
        }
        if (this.isVertical()) {
            let tbPos: string = (this.options.headerPlacement === 'Left') ? CLS_VLEFT : CLS_VRIGHT;
            if (!this.element.classList.contains(CLS_NEST)) {
                addClass([this.element], [CLS_VTAB, tbPos]);
            } else {
                addClass([this.hdrEle], [CLS_VTAB, tbPos]);
            }
        }
        this.setActiveBorder();
        this.focusItem();
    }
    private changeToolbarOrientation(toolbarEle: BlazorToolbarElement, isVertical: boolean): void {
        if (toolbarEle.blazor__instance) {
            // tslint:disable:no-any
            (toolbarEle.blazor__instance as any).options.width = (isVertical ? 'auto' : '100%');
            (toolbarEle.blazor__instance as any).options.height = (isVertical ? '100%' : 'auto');
            (toolbarEle.blazor__instance as any).options.isVertical = isVertical;
            (toolbarEle.blazor__instance as any).changeOrientation();
            // tslint:enable:no-any
        }
        this.updatePopAnimationConfig();
    }
    private setOrientation(place: string, ele: HTEle): void {
        let headerPos: number = Array.prototype.indexOf.call(this.element.children, ele);
        let contentPos: number = Array.prototype.indexOf.call(this.element.children, this.element.querySelector('.' + CLS_CONTENT));
        if (place === 'Bottom' && (contentPos > headerPos)) {
            this.element.appendChild(ele);
        } else {
            removeClass([ele], [CLS_HBOTTOM]);
            this.element.insertBefore(ele, select('.' + CLS_CONTENT, this.element));
        }
    }
    public setCssClass(ele: HTEle, cls: string, val: boolean): void {
        if (cls === '') { return; }
        if (val) {
            addClass([ele], cls.split(' '));
        } else {
            removeClass([ele], cls.split(' '));
        }
    }
    private setActiveBorder(): void {
        let bar: HTEle;
        let scrollCnt: HTEle;
        let trgHdrEle: Element = this.getTabHeader();
        let trg: HTEle = <HTEle>select('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE, trgHdrEle);
        if (trg === null) { return; }
        if (trg.classList.contains(CLS_TB_POPUP)) {
            this.popupHandler(trg);
        }
        let root: HTEle = <HTEle>closest(trg, '.' + CLS_TAB);
        if (this.element !== root) { return; }
        this.tbItems = <HTEle>select('.' + CLS_TB_ITEMS, trgHdrEle);
        bar = <HTEle>select('.' + CLS_INDICATOR, trgHdrEle);
        scrollCnt = <HTEle>select('.' + CLS_TB_ITEMS + ' .' + this.scrCntClass, trgHdrEle);
        if (this.isVertical()) {
            setStyle(bar, { 'left': '', 'right': '' });
            let tbHeight: number = (isNOU(scrollCnt)) ? this.tbItems.offsetHeight : scrollCnt.offsetHeight;
            if (tbHeight !== 0) {
                setStyle(bar, { 'top': trg.offsetTop + 'px', 'height': trg.offsetHeight + 'px' });
            } else {
                setStyle(bar, { 'top': 0, 'height': 0 });
            }
        } else {
            setStyle(bar, { 'top': '', 'height': '' });
            let tbWidth: number = (isNOU(scrollCnt)) ? this.tbItems.offsetWidth : scrollCnt.offsetWidth;
            if (tbWidth !== 0) {
                setStyle(bar, { 'left': trg.offsetLeft + 'px', 'right': tbWidth - (trg.offsetLeft + trg.offsetWidth) + 'px' });
            } else {
                setStyle(bar, { 'left': 'auto', 'right': 'auto' });
            }
        }
        if (!isNOU(this.bdrLine)) { this.bdrLine.classList.remove(CLS_HIDDEN); }
    }
    private setActive(value: number): void {
        this.tbItem = selectAll('.' + CLS_TB_ITEM, this.getTabHeader());
        let trg: HTMLElement = this.hdrEle.querySelector('.' + CLS_TB_ITEM + '[data-index="' + value + '"]');
        if (!trg || value < 0 || isNaN(value) || this.tbItem.length === 0) { return; }
        this.options.selectedItem = value;
        if (trg.classList.contains(CLS_ACTIVE)) {
            this.setActiveBorder();
            return;
        }
        let prev: HTEle = this.tbItem[this.prevIndex];
        if (!isNOU(prev)) { prev.removeAttribute('aria-controls'); }
        attributes(trg, { 'aria-controls': CLS_CONTENT + this.tabId + '_' + value });
        let id: string = trg.id;
        this.removeActiveClass();
        trg.classList.add(CLS_ACTIVE);
        trg.setAttribute('aria-selected', 'true');
        let no: number = Number(this.extIndex(id));
        if (isNOU(this.prevActiveEle)) {
            this.prevActiveEle = CLS_CONTENT + this.tabId + '_' + no;
        }
        attributes(this.element, { 'aria-activedescendant': id });
        if (this.options.loadOn === 'Init') {
            this.cntEle = <HTEle>select('.' + CLS_TAB + ' > .' + CLS_CONTENT, this.element);
            let item: HTEle = this.getTrgContent(this.cntEle, this.extIndex(id));
            if (!isNOU(item)) {
                item.classList.add(CLS_ACTIVE);
            }
            this.triggerAnimation(id, this.enableAnimation);
        }
        this.setActiveBorder();
        this.refreshItemVisibility(trg);
        if (!this.initRender) {
            (<HTEle>trg.firstElementChild).focus();
        }
    }
    public contentReady(): void {
        let id: string = this.setActiveContent();
        this.triggerAnimation(id, this.enableAnimation);
    }
    public setRTL(value: boolean): void {
        this.setCssClass(this.element, CLS_RTL, value);
        this.refreshActiveBorder();
    }
    public refreshActiveBorder(): void {
        if (!isNOU(this.bdrLine)) { this.bdrLine.classList.add(CLS_HIDDEN); }
        this.setActiveBorder();
    }
    private showPopup(config: object): void {
        let tbPop: HTEle = <HTEle>select('.e-popup.e-toolbar-pop', this.hdrEle);
        if (tbPop.classList.contains('e-popup-close')) {
            let tbPopObj: Popup = (<PopupModel>(tbPop && (<Instance>tbPop).ej2_instances[0])) as Popup;
            tbPopObj.position.X = (this.options.headerPlacement === 'Left') ? 'left' : 'right';
            tbPopObj.dataBind();
            tbPopObj.show(config);
        }
    }
    private wireEvents(): void {
        window.addEventListener('resize', this.resizeContext);
        EventHandler.add(this.element, 'keydown', this.spaceKeyDown, this);
        if (!isNOU(this.cntEle)) { this.touchModule = new Touch(this.cntEle, { swipe: this.swipeHandler.bind(this) }); }
        this.keyModule = new KeyboardEvents(this.element, { keyAction: this.keyHandler.bind(this), keyConfigs: this.keyConfigs });
        this.tabKeyModule = new KeyboardEvents(this.element, {
            keyAction: this.keyHandler.bind(this),
            keyConfigs: { openPopup: 'shift+f10', tab: 'tab', shiftTab: 'shift+tab' },
            eventName: 'keydown'
        });
    }
    private unWireEvents(): void {
        this.keyModule.destroy();
        this.tabKeyModule.destroy();
        if (!isNOU(this.cntEle)) { this.touchModule.destroy(); }
        window.removeEventListener('resize', this.resizeContext);
        EventHandler.remove(this.element, 'keydown', this.spaceKeyDown);
        removeClass([this.element], [CLS_RTL, CLS_FOCUS]);
    }
    private swipeHandler(e: SwipeEventArgs): void {
        if (e.velocity < 3 && isNOU(e.originalEvent.changedTouches)) { return; }
        if (e.originalEvent) {
            e.originalEvent.stopPropagation();
        }
        this.isSwipeed = true;
        if (e.swipeDirection === 'Right' && this.options.selectedItem !== 0) {
            for (let k: number = this.options.selectedItem - 1; k >= 0; k--) {
                if (!this.tbItem[k].classList.contains(CLS_HIDDEN)) {
                    this.select(k);
                    break;
                }
            }
        } else if (e.swipeDirection === 'Left' && (this.options.selectedItem !== selectAll('.' + CLS_TB_ITEM, this.element).length - 1)) {
            for (let i: number = this.options.selectedItem + 1; i < this.tbItem.length; i++) {
                if (!this.tbItem[i].classList.contains(CLS_HIDDEN)) {
                    this.select(i);
                    break;
                }
            }
        }
        this.isSwipeed = false;
    }
    private spaceKeyDown(e: KeyboardEvent): void {
        if ((e.keyCode === SPACEBAR && e.which === SPACEBAR) || (e.keyCode === END && e.which === END)) {
            let clstHead: HTEle = <HTEle>closest(<Element>e.target, '.' + CLS_HEADER);
            if (!isNOU(clstHead)) {
                e.preventDefault();
            }
        }
    }
    private keyHandler(e: KeyboardEventArgs): void {
        if (this.element.classList.contains(CLS_DISABLE)) { return; }
        this.element.classList.add(CLS_FOCUS);
        let trg: HTEle = <HTEle>e.target;
        let tabHeader: HTMLElement = this.getTabHeader();
        let actEle: HTEle = <HTEle>select('.' + CLS_ACTIVE, tabHeader);
        this.popEle = <DomElements>select('.' + CLS_TB_POP, tabHeader);
        if (!isNOU(this.popEle)) { this.popObj = <Popup>this.popEle.ej2_instances[0]; }
        switch (e.action) {
            case 'space':
            case 'enter':
                if (trg.parentElement.classList.contains(CLS_DISABLE)) { return; }
                if (e.action === 'enter' && trg.classList.contains('e-hor-nav')) {
                    this.showPopup(this.show);
                    break;
                }
                this.keyPressed(trg);
                break;
            case 'tab':
            case 'shiftTab':
                if (trg.classList.contains(CLS_WRAP)
                    && (<HTEle>closest(trg, '.' + CLS_TB_ITEM)).classList.contains(CLS_ACTIVE) === false) {
                    trg.setAttribute('tabindex', '-1');
                }
                if (this.popObj && isVisible(this.popObj.element)) {
                    this.popObj.hide(this.hide);
                }
                actEle.children.item(0).setAttribute('tabindex', '0');
                break;
            case 'moveLeft':
            case 'moveRight':
                let item: HTEle = <HTEle>closest(document.activeElement, '.' + CLS_TB_ITEM);
                if (!isNOU(item)) { this.refreshItemVisibility(item); }
                break;
            case 'openPopup':
                e.preventDefault();
                if (!isNOU(this.popEle) && this.popEle.classList.contains(CLS_POPUP_CLOSE)) { this.popObj.show(this.show); }
                break;
            case 'delete':
                let trgParent: HTEle = <HTEle>closest(trg, '.' + CLS_TB_ITEM);
                if (this.options.showCloseButton === true && !isNOU(trgParent)) {
                    let nxtSib: HTEle = <HTEle>trgParent.nextSibling;
                    if (!isNOU(nxtSib) && nxtSib.classList.contains(CLS_TB_ITEM)) { (<HTEle>nxtSib.firstElementChild).focus(); }
                    this.dotNetRef.invokeMethodAsync('RemoveTab', parseInt(trgParent.getAttribute('data-index'), 10));
                }
                this.setActiveBorder();
                break;
        }
    }
    public refreshActElePosition(): void {
        let activeEle: Element = select('.' + CLS_TB_ITEM + '.' + CLS_TB_POPUP + '.' + CLS_ACTIVE, this.element);
        if (!isNOU(activeEle)) {
            this.select(this.getEleIndex(<HTEle>activeEle));
        }
        this.refreshActiveBorder();
    }
    private refreshItemVisibility(target: HTEle): void {
        let scrCnt: HTEle = <HTEle>select('.' + this.scrCntClass, this.tbItems);
        if (!this.isVertical() && !isNOU(scrCnt)) {
            let scrBar: HTEle = <HTEle>select('.e-hscroll-bar', this.tbItems);
            let scrStart: number = scrBar.scrollLeft;
            let scrEnd: number = scrStart + scrBar.offsetWidth;
            let eleStart: number = target.offsetLeft;
            let eleWidth: number = target.offsetWidth;
            let eleEnd: number = target.offsetLeft + target.offsetWidth;
            if ((scrStart < eleStart) && (scrEnd < eleEnd)) {
                let eleViewRange: number = scrEnd - eleStart;
                scrBar.scrollLeft = scrStart + (eleWidth - eleViewRange);
            } else {
                if ((scrStart > eleStart) && (scrEnd > eleEnd)) {
                    let eleViewRange: number = eleEnd - scrStart;
                    scrBar.scrollLeft = scrStart - (eleWidth - eleViewRange);
                }
            }
        } else { return; }
    }
    public enableTab(index: number, value: boolean): void {
        let tbItems: HTEle = selectAll('.' + CLS_TB_ITEM, this.element)[index];
        if (isNOU(tbItems)) { return; }
        if (value === true) {
            tbItems.classList.remove(CLS_DISABLE, CLS_OVERLAY);
            (<HTEle>tbItems.firstElementChild).setAttribute('tabindex', '-1');
        } else {
            tbItems.classList.add(CLS_DISABLE, CLS_OVERLAY);
            (<HTEle>tbItems.firstElementChild).removeAttribute('tabindex');
            if (tbItems.classList.contains(CLS_ACTIVE)) { this.select(index + 1); }
        }
        tbItems.setAttribute('aria-disabled', (value === true) ? 'false' : 'true');
    }
    public hideTab(index: number, value: boolean = true): void {
        let items: HTMLElement[];
        let item: HTEle = selectAll('.' + CLS_TB_ITEM, this.element)[index];
        if (isNOU(item)) { return; }
        this.bdrLine.classList.add(CLS_HIDDEN);
        if (value) {
            item.classList.add(CLS_HIDDEN);
            items = selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_HIDDEN + ')', this.tbItems);
            if (items.length !== 0 && item.classList.contains(CLS_ACTIVE)) {
                if (index !== 0) {
                    for (let i: number = index - 1; i >= 0; i--) {
                        if (!this.tbItem[i].classList.contains(CLS_HIDDEN)) {
                            this.select(i);
                            break;
                        } else if (i === 0) {
                            for (let k: number = index + 1; k < this.tbItem.length; k++) {
                                if (!this.tbItem[k].classList.contains(CLS_HIDDEN)) {
                                    this.select(k);
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    for (let k: number = index + 1; k < this.tbItem.length; k++) {
                        if (!this.tbItem[k].classList.contains(CLS_HIDDEN)) {
                            this.select(k);
                            break;
                        }
                    }
                }
            } else if (items.length === 0) {
                this.element.classList.add(CLS_HIDDEN);
            }
        } else {
            this.element.classList.remove(CLS_HIDDEN);
            items = selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_HIDDEN + ')', this.tbItems);
            item.classList.remove(CLS_HIDDEN);
            if (items.length === 0) { this.select(index); }
        }
        this.setActiveBorder();
        item.setAttribute('aria-hidden', '' + value);
    }
    public select(args: number): void {
        let tabHeader: HTMLElement = this.getTabHeader();
        this.tbItems = <HTEle>select('.' + CLS_TB_ITEMS, tabHeader);
        this.tbItem = selectAll('.' + CLS_TB_ITEM, tabHeader);
        this.prevItem = this.tbItem[this.prevIndex];
        let value: number;
        let selectedItem: number = this.options.selectedItem;
        if (isNOU(selectedItem) || (selectedItem < 0) || (this.tbItem.length <= selectedItem) || isNaN(selectedItem)) {
            this.options.selectedItem = 0;
        }
        let trg: HTEle = this.tbItem[args as number];
        if (!isNOU(this.prevItem) && !this.prevItem.classList.contains(CLS_DISABLE)) {
            this.prevItem.children.item(0).setAttribute('tabindex', '-1');
        }
        if (!this.initRender) {
            if (trg) {
                value = parseInt(trg.getAttribute('data-index'), 10);
            }
            let eventArg: SelectingEventArgs = {
                previousItem: this.prevItem,
                previousIndex: this.prevIndex,
                selectedItem: this.tbItem[this.options.selectedItem],
                selectedIndex: this.options.selectedItem,
                selectedContent: null,
                selectingItem: trg,
                selectingIndex: value,
                selectingContent: null,
                isSwiped: this.isSwipeed,
                cancel: false
            };
            this.dotNetRef.invokeMethodAsync('SelectingEvent', eventArg, value);
        } else {
            this.selectingContent(args);
        }
    }
    public selectingContent(args: number): void {
        this.tbItem = selectAll('.' + CLS_TB_ITEM, this.hdrEle);
        if (this.tbItem.length > args && args >= 0 && !isNaN(args)) {
            this.prevIndex = this.options.selectedItem;
            let item: HTMLElement = this.hdrEle.querySelector('.' + CLS_TB_ITEM + '[data-index="' + args + '"]');
            if (item && item.classList.contains(CLS_TB_POPUP)) {
                this.popupHandler(item);
            }
            this.setActive(args);
        } else {
            this.setActive(0);
        }
    }
    public disable(value: boolean): void {
        this.setCssClass(this.element, CLS_DISABLE, value);
        this.element.setAttribute('aria-disabled', '' + value);
    }
    public headerItemsUpdate(args: number): void {
        let tabHeader: HTMLElement = this.getTabHeader();
        this.tbItems = <HTEle>select('.' + CLS_TB_ITEMS, tabHeader);
        this.tbItem = selectAll('.' + CLS_TB_ITEM, tabHeader);
        this.prevItem = this.tbItem[this.prevIndex];
        if (!isNOU(this.prevItem) && !this.prevItem.classList.contains(CLS_DISABLE)) {
            this.prevItem.children.item(0).setAttribute('tabindex', '-1');
        }
        this.selectingContent(args);
    }
    public destroy(): void {
        this.unWireEvents();
        ['aria-disabled', 'aria-activedescendant', 'tabindex'].forEach((val: string): void => {
            this.element.removeAttribute(val);
        });
    }
    public getContentElement(index: number): HTMLElement {
        return <HTEle>select('.' + CLS_CONTENT + ' #' + CLS_CONTENT + this.tabId + '_' + index, this.element);
    }
}

interface ITabOptions {
    width: string;
    height: string;
    cssClass: string;
    selectedItem: number;
    headerPlacement: HeaderPosition;
    loadOn: ContentLoad;
    showCloseButton: boolean;
    scrollStep: number;
    enableRtl: boolean;
    animation: TabAnimationSettingsModel;
    enablePersistence: boolean;
}

interface BlazorTabElement extends HTMLElement {
    blazor__instance: SfTab;
}

interface BlazorToolbarElement extends HTMLElement {
    blazor__instance: { [key: string]: Object };
}

// tslint:disable
let Tab: object = {
    initialize(element: BlazorTabElement, options: ITabOptions, dotnetRef: BlazorDotnetObject): void {
        let instance: SfTab = new SfTab(element, options, dotnetRef);
        instance.render();
    },
    headerReady(element: BlazorTabElement, isCreatedEvent: boolean): void {
        if (element.blazor__instance) {
            element.blazor__instance.headerReady();
            if (!isCreatedEvent) {
                element.blazor__instance.dotNetRef.invokeMethodAsync("CreatedEvent", null);
            }
        }
    },
    contentReady(element: BlazorTabElement, selectingIndex: number, isPopup: boolean): void {
        if (element.blazor__instance) {
            element.classList.remove(CLS_FOCUS);
            element.blazor__instance.isPopup = isPopup;
            element.blazor__instance.headerItemsUpdate(selectingIndex);
            if (element.blazor__instance.options.loadOn !== 'Init') {
                element.blazor__instance.contentReady();
            }
        }
    },
    selectingContent(element: BlazorTabElement, selectingIndex: number): void {
        if (element.blazor__instance) {
            element.blazor__instance.selectingContent(selectingIndex);
            if (element.blazor__instance.options.loadOn !== 'Init') {
                element.blazor__instance.contentReady();
            }
        }
    },
    serverItemsChanged(element: BlazorTabElement, selectedItem: number, animation: TabAnimationSettingsModel, isVerticalIcon: boolean): void {
        if (element.blazor__instance) {
            element.blazor__instance.options.selectedItem = selectedItem;
            element.blazor__instance.options.animation = animation;
            if (isVerticalIcon) {
                addClass([element], CLS_VERTICAL_ICON);
            } else {
                removeClass([element], CLS_VERTICAL_ICON);
            }
            element.blazor__instance.serverItemsChanged();
        }
    },
    enableTab(element: BlazorTabElement, index: number, value: boolean): void {
        if (element.blazor__instance) {
            element.blazor__instance.enableTab(index, value);
        }
    },
    hideTab(element: BlazorTabElement, index: number, value: boolean): void {
        if (element.blazor__instance) {
            element.blazor__instance.hideTab(index, value);
        }
    },
    select(element: BlazorTabElement, index: number): void {
        if (element.blazor__instance) {
            element.blazor__instance.select(index);
        }
    },
    disable(element: BlazorTabElement, value: boolean): void {
        if (element.blazor__instance) {
            element.blazor__instance.disable(value);
        }
    },
    setCssClass(element: BlazorTabElement, cssClass: string): void {
        if (element.blazor__instance) {
            if (element.blazor__instance.options.cssClass !== '') {
                element.blazor__instance.setCssClass(element, element.blazor__instance.options.cssClass, false);
            }
            element.blazor__instance.setCssClass(element, cssClass, true);
            element.blazor__instance.options.cssClass = cssClass;
        }
    },
    showCloseButton(element: BlazorTabElement, showCloseButton: boolean): void {
        if (element.blazor__instance) {
            element.blazor__instance.options.showCloseButton = showCloseButton;
            element.blazor__instance.refreshActElePosition();
        }
    },
    headerPlacement(element: BlazorTabElement, headerPlacement: HeaderPosition, selectedItem: number,
        toolbarEle: BlazorToolbarElement, toolbarCssClass: string, isVertical: boolean, isOrientationChange: boolean): void {
        element.blazor__instance.options.headerPlacement = headerPlacement;
        element.blazor__instance.options.selectedItem = selectedItem;
        if (toolbarEle.blazor__instance) {
            // tslint:disable-next-line:no-any
            (toolbarEle.blazor__instance as any).setCssClass(toolbarCssClass);
        }
        element.blazor__instance.serverChangeOrientation(headerPlacement, toolbarEle, isVertical, isOrientationChange)
    },
    enableRtl(element: BlazorTabElement, enableRtl: boolean): void {
        if (element.blazor__instance) {
            element.blazor__instance.options.enableRtl = enableRtl;
            element.blazor__instance.setRTL(enableRtl);
        }
    },
    overflowMode(element: BlazorTabElement): void {
        if (element.blazor__instance) {
            element.blazor__instance.refreshActElePosition();
        }
    },
    refresh(element: BlazorTabElement): void {
        if (element.blazor__instance) {
            element.blazor__instance.refreshActiveBorder();
        }
    },
    destroy(element: BlazorTabElement, elementId: string, selectedItem: string): void {
        if (element.blazor__instance) {
            if (element.blazor__instance.options.enablePersistence) {
                window.localStorage.setItem(elementId, selectedItem);
            }
            element.blazor__instance.destroy();
        }
    },
    getTabItem(element: HTMLElement, index: number): string {
        let dom: HTMLElement = element.querySelector('.' + CLS_TB_ITEM + '[data-index="' + index + '"]');
        if (dom) {
            // tslint:disable-next-line:no-any
            return JSON.stringify((window as any).sfBlazor.getDomObject("tabitem", dom));
        }
        return null;
    },
    getTabContent(element: BlazorTabElement, index: number): string {
        if (element.blazor__instance) {
            let dom: HTMLElement = element.blazor__instance.getContentElement(index);
            if (dom) {
                // tslint:disable-next-line:no-any
                return JSON.stringify((window as any).sfBlazor.getDomObject("tabcontent", dom));
            }
        }
        return null;
    }
};
export default Tab;