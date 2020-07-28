import { BlazorDotnetObject, KeyboardEvents, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { createElement, EventHandler, formatUnit, append, addClass, removeClass } from '@syncfusion/ej2-base';
import { selectAll, setStyleAttribute as setStyle, Browser, isVisible } from '@syncfusion/ej2-base';
import { closest, detach, classList, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { ItemModel } from '../src/toolbar';
import { Popup, calculatePosition } from '@syncfusion/ej2-popups';
import { HScroll } from '../src/common/h-scroll';
import { VScroll } from '../src/common/v-scroll';

type OverflowMode = 'Scrollable' | 'Popup' | 'MultiRow' | 'Extended';
type HTEle = HTMLElement;
type ItmAlign = 'lefts' | 'centers' | 'rights';
type ItemAlign = 'Left' | 'Center' | 'Right';

const CLS_VERTICAL: string = 'e-vertical';
const CLS_ITEMS: string = 'e-toolbar-items';
const BZ_ITEMS: string = 'e-blazor-toolbar-items';
const CLS_ITEM: string = 'e-toolbar-item';
const CLS_RTL: string = 'e-rtl';
const CLS_SEPARATOR: string = 'e-separator';
const CLS_POPUPICON: string = 'e-popup-up-icon';
const CLS_POPUPDOWN: string = 'e-popup-down-icon';
const CLS_POPUPOPEN: string = 'e-popup-open';
const CLS_TEMPLATE: string = 'e-template';
const CLS_DISABLE: string = 'e-overlay';
const CLS_POPUPTEXT: string = 'e-toolbar-text';
const CLS_TBARTEXT: string = 'e-popup-text';
const CLS_TBAROVERFLOW: string = 'e-overflow-show';
const CLS_POPOVERFLOW: string = 'e-overflow-hide';
const CLS_TBARNAV: string = 'e-hor-nav';
const CLS_TBARSCRLNAV: string = 'e-scroll-nav';
const CLS_TBARRIGHT: string = 'e-toolbar-right';
const CLS_TBARLEFT: string = 'e-toolbar-left';
const CLS_TBARCENTER: string = 'e-toolbar-center';
const CLS_TBARPOS: string = 'e-tbar-pos';
const CLS_HSCROLLCNT: string = 'e-hscroll-content';
const CLS_VSCROLLCNT: string = 'e-vscroll-content';
const CLS_POPUPNAV: string = 'e-hor-nav';
const CLS_POPUPCLASS: string = 'e-toolbar-pop';
const CLS_POPUP: string = 'e-toolbar-popup';
const CLS_TBARBTNTEXT: string = 'e-tbar-btn-text';
const CLS_TBARNAVACT: string = 'e-nav-active';
const CLS_TBARIGNORE: string = 'e-ignore';
const CLS_POPPRI: string = 'e-popup-alone';
const CLS_HIDDEN: string = 'e-hidden';
const CLS_MULTIROW: string = 'e-toolbar-multirow';
const CLS_MULTIROWPOS: string = 'e-multirow-pos';
const CLS_MULTIROW_SEPARATOR: string = 'e-multirow-separator';
const CLS_EXTENDABLE_SEPARATOR: string = 'e-extended-separator';
const CLS_EXTEANDABLE_TOOLBAR: string = 'e-extended-toolbar';
const CLS_EXTENDABLECLASS: string = 'e-toolbar-extended';
const CLS_EXTENDPOPUP: string = 'e-expended-nav';
const CLS_EXTENDEDPOPOPEN: string = 'e-tbar-extended';
const CLS_ICON_CLOSE: string = 'e-close-icon';
const TAB: number = 9;
const DOWNARROW: number = 40;
const UPARROW: number = 38;
const END: number = 35;
const HOME: number = 36;

interface ToolbarItemAlignIn {
    lefts: HTMLElement[];
    centers: HTMLElement[];
    rights: HTMLElement[];
}

class SfToolbar {
    public popObj: Popup;
    private trgtEle: HTEle;
    private tbarEle: HTMLElement[];
    private tbarAlgEle: ToolbarItemAlignIn;
    public tbarAlign: boolean;
    private tbarEleMrgn: number;
    private tbResize: boolean;
    private offsetWid: number;
    private keyModule: KeyboardEvents;
    public scrollModule: HScroll | VScroll;
    private activeEle: HTEle;
    private popupPriCount: number;
    private isExtendedOpen: boolean;
    private resizeContext: EventListenerObject = this.resize.bind(this);
    private keyConfigs: { [key: string]: string } = {
        moveLeft: 'leftarrow',
        moveRight: 'rightarrow',
        moveUp: 'uparrow',
        moveDown: 'downarrow',
        popupOpen: 'enter',
        popupClose: 'escape',
        tab: 'tab',
        home: 'home',
        end: 'end',
    };
    public element: BlazorToolbarElement;
    public dotNetRef: BlazorDotnetObject;
    public options: IToolbarOptions;
    constructor(element: BlazorToolbarElement, options: IToolbarOptions, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        if (!isNOU(element)) {
            this.element.blazor__instance = this;
        }
        this.dotNetRef = dotnetRef;
        this.options = options;
    }
    public destroy(): void {
        this.unwireEvents();
        this.resetServerItems();
        for (let elem of [].slice.call(this.element.children)) {
            if (!elem.classList.contains(BZ_ITEMS)) {
                this.element.removeChild(elem);
            }
        }
        this.clearProperty();
        this.popObj = null;
        this.tbarAlign = null;
        removeClass([this.element], 'e-toolpop');
        if (this.options.cssClass) {
            removeClass([this.element], this.options.cssClass.split(' '));
        }
        this.element.removeAttribute('style');
        ['aria-disabled', 'aria-orientation', 'aria-haspopup', 'role'].forEach((attrb: string): void =>
            this.element.removeAttribute(attrb));
        removeClass([this.element], ['e-toolbar']);
    }
    private wireEvents(): void {
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        window.addEventListener('resize', this.resizeContext);
        if (this.options.allowKeyboard) {
            this.wireKeyboardEvent();
        }
    }
    public wireKeyboardEvent(): void {
        this.keyModule = new KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs
        });
        EventHandler.add(this.element, 'keydown', this.docKeyDown, this);
        this.element.setAttribute('tabIndex', '0');
    }
    public unwireKeyboardEvent(): void {
        if (this.keyModule) {
            EventHandler.remove(this.element, 'keydown', this.docKeyDown);
            this.keyModule.destroy();
            this.keyModule = null;
        }
    }
    private docKeyDown(e: KeyboardEvent): void {
        if ((<HTEle>e.target).tagName === 'INPUT') { return; }
        let popCheck: boolean = !isNOU(this.popObj) && isVisible(this.popObj.element) && this.options.overflowMode !== 'Extended';
        if (e.keyCode === TAB && (<HTEle>e.target).classList.contains('e-hor-nav') === true && popCheck) {
            this.popObj.hide({ name: 'FadeOut', duration: 100 });
        }
        let keyCheck: boolean = (e.keyCode === DOWNARROW || e.keyCode === UPARROW || e.keyCode === END || e.keyCode === HOME);
        if (keyCheck) {
            e.preventDefault();
        }
    }
    private unwireEvents(): void {
        EventHandler.remove(this.element, 'click', this.clickHandler);
        this.destroyScroll();
        this.unwireKeyboardEvent();
        window.removeEventListener('resize', this.resizeContext);
        EventHandler.remove(document, 'scroll', this.docEvent);
        EventHandler.remove(document, 'click', this.docEvent);
    }
    private clearProperty(): void {
        this.tbarEle = [];
        this.tbarAlgEle = { lefts: [], centers: [], rights: [] };
    }
    private docEvent(e: Event): void {
        let popEle: Element = closest(<Element>e.target, '.e-popup');
        if (this.popObj && isVisible(this.popObj.element) && !popEle && this.options.overflowMode === 'Popup') {
            this.popObj.hide({ name: 'FadeOut', duration: 100 });
        }
    }
    private destroyScroll(): void {
        if (this.scrollModule) {
            if (this.tbarAlign) { addClass([this.scrollModule.element], CLS_TBARPOS); }
            this.scrollModule.destroy(); this.scrollModule = null;
        }
    }
    public destroyMode(): void {
        if (this.scrollModule) {
            removeClass([this.scrollModule.element], CLS_RTL);
            this.destroyScroll();
        }
        removeClass([this.element], CLS_EXTENDEDPOPOPEN);
        removeClass([this.element], CLS_EXTEANDABLE_TOOLBAR);
        let tempEle: HTMLElement = this.element.querySelector('.e-toolbar-multirow');
        if (tempEle) { removeClass([tempEle], CLS_MULTIROW); }
        if (this.popObj) {
            this.popupRefresh(this.popObj.element, true);
        }
    }
    private elementFocus(ele: HTEle): void {
        let fChild: HTEle = <HTEle>ele.firstElementChild;
        if (fChild) {
            fChild.focus();
            this.activeEleSwitch(ele);
        } else {
            ele.focus();
        }
    }
    private clstElement(tbrNavChk: Boolean, trgt: HTEle): HTEle {
        let clst: HTEle;
        if (tbrNavChk && this.popObj && isVisible(this.popObj.element)) {
            clst = <HTEle>this.popObj.element.querySelector('.' + CLS_ITEM);
        } else if (this.element === trgt || tbrNavChk) {
            // tslint:disable-next-line:max-line-length
            clst = <HTEle>this.element.querySelector('.' + CLS_ITEM + ':not(.' + CLS_DISABLE + ' ):not(.' + CLS_SEPARATOR + ' ):not(.' + CLS_HIDDEN + ' )');
        } else {
            clst = <HTEle>closest(trgt, '.' + CLS_ITEM);
        }
        return clst;
    }
    private keyHandling(clst: HTEle, e: KeyboardEventArgs, trgt: HTEle, navChk: Boolean, scrollChk: Boolean): void {
        let popObj: Popup = this.popObj;
        let rootEle: HTEle = this.element;
        let popAnimate: Object = { name: 'FadeOut', duration: 100 };
        switch (e.action) {
            case 'moveRight':
                if (this.options.isVertical) { return; }
                if (rootEle === trgt) {
                    this.elementFocus(clst);
                } else if (!navChk) {
                    this.eleFocus(clst, 'next');
                }
                break;
            case 'moveLeft':
                if (this.options.isVertical) { return; }
                if (!navChk) {
                    this.eleFocus(clst, 'previous');
                }
                break;
            case 'home':
            case 'end':
                let ele: HTEle;
                let nodes: NodeList;
                if (clst) {
                    let popupCheck: HTEle = <HTEle>closest(clst, '.e-popup');
                    if (popupCheck) {
                        if (isVisible(this.popObj.element)) {
                            nodes = [].slice.call(popupCheck.children);
                            if (e.action === 'home') {
                                ele = <HTEle>nodes[0];
                            } else {
                                ele = <HTEle>nodes[nodes.length - 1];
                            }
                        }
                    } else {
                        nodes = this.element.querySelectorAll('.' + CLS_ITEMS + ' .' + CLS_ITEM);
                        if (e.action === 'home') {
                            ele = <HTEle>nodes[0];
                        } else {
                            ele = <HTEle>nodes[nodes.length - 1];
                        }
                    }
                    if (ele) {
                        this.elementFocus(ele);
                    }
                }
                break;
            case 'moveUp':
            case 'moveDown':
                let value: string = e.action === 'moveUp' ? 'previous' : 'next';
                if (!this.options.isVertical) {
                    if (popObj && closest(trgt, '.e-popup')) {
                        let popEle: HTEle = popObj.element;
                        let popFrstEle: HTEle = popEle.firstElementChild as HTEle;
                        if ((value === 'previous' && popFrstEle === clst) || (value === 'next' && popEle.lastElementChild === clst)) {
                            return;
                        } else {
                            this.eleFocus(clst, value);
                        }
                    } else if (e.action === 'moveDown' && popObj && isVisible(popObj.element)) {
                        this.elementFocus(clst);
                    }
                } else {
                    if (e.action === 'moveUp') {
                        this.eleFocus(clst, 'previous');
                    } else {
                        this.eleFocus(clst, 'next');
                    }
                }
                break;
            case 'tab':
                if (!scrollChk && !navChk) {
                    let ele: HTEle = (<HTEle>clst.firstElementChild);
                    if (rootEle === trgt) {
                        if (this.activeEle) {
                            this.activeEle.focus();
                        } else {
                            this.activeEleRemove(ele);
                            ele.focus();
                        }
                        this.element.removeAttribute('tabindex');
                    }
                }
                break;
            case 'popupClose':
                if (popObj && this.options.overflowMode !== 'Extended') {
                    popObj.hide(popAnimate);
                }
                break;
            case 'popupOpen':
                if (!navChk) { return; }
                if (popObj && !isVisible(popObj.element)) {
                    popObj.element.style.top = rootEle.offsetHeight + 'px';
                    popObj.show({ name: 'FadeIn', duration: 100 });
                } else {
                    popObj.hide(popAnimate);
                }
                break;
        }
    }
    private keyActionHandler(e: KeyboardEventArgs): void {
        let trgt: HTEle = <HTEle>e.target;
        if (trgt.tagName === 'INPUT' || trgt.tagName === 'TEXTAREA' || this.element.classList.contains(CLS_DISABLE)) {
            return;
        }
        e.preventDefault();
        let clst: HTEle;
        let tbrNavChk: boolean = trgt.classList.contains(CLS_TBARNAV);
        let tbarScrollChk: boolean = trgt.classList.contains(CLS_TBARSCRLNAV);
        clst = this.clstElement(tbrNavChk, trgt);
        if (clst || tbarScrollChk) {
            this.keyHandling(clst, e, trgt, tbrNavChk, tbarScrollChk);
        }
    }
    private eleContains(el: HTEle): string | boolean {
        // tslint:disable-next-line:max-line-length
        return el.classList.contains(CLS_SEPARATOR) || el.classList.contains(CLS_DISABLE) || el.getAttribute('disabled') || el.classList.contains(CLS_HIDDEN) || !isVisible(el);
        // tslint:enable-next-line:max-line-length
    }
    private eleFocus(closest: HTEle, pos: string): void {
        let sib: HTEle = Object(closest)[pos + 'ElementSibling'];
        if (sib) {
            let skipEle: string | boolean = this.eleContains(sib);
            if (skipEle) {
                this.eleFocus(sib, pos); return;
            }
            this.elementFocus(sib);
        } else if (this.tbarAlign) {
            let elem: HTEle = Object(closest.parentElement)[pos + 'ElementSibling'] as HTEle;
            if (!isNOU(elem) && elem.children.length === 0) {
                elem = Object(elem)[pos + 'ElementSibling'] as HTEle;
            }
            if (!isNOU(elem) && elem.children.length > 0) {
                if (pos === 'next') {
                    let el: HTEle = <HTEle>elem.querySelector('.' + CLS_ITEM);
                    if (this.eleContains(el)) {
                        this.eleFocus(el, pos);
                    } else {
                        (<HTEle>el.firstElementChild).focus();
                        this.activeEleSwitch(el);
                    }
                } else {
                    let el: HTEle = <HTEle>elem.lastElementChild;
                    if (this.eleContains(el)) {
                        this.eleFocus(el, pos);
                    } else {
                        this.elementFocus(el);
                    }
                }
            }
        }
    }
    private clickHandler(e: Event): void {
        let trgt: HTEle = <HTEle>e.target;
        let clsList: DOMTokenList = trgt.classList;
        let ele: HTEle = this.element;
        let isPopupElement: boolean = !isNOU(closest(trgt, '.' + CLS_POPUPCLASS));
        let isCloseIcon: boolean = clsList.contains(CLS_ICON_CLOSE);
        let popupNav: HTEle = <HTEle>closest(trgt, ('.' + CLS_TBARNAV));
        let trgParentDataIndex: number;
        if (!popupNav) {
            popupNav = trgt;
        }
        if (!ele.children[0].classList.contains('e-hscroll') && !ele.children[0].classList.contains('e-vscroll')
            && (clsList.contains(CLS_TBARNAV))) {
            clsList = trgt.querySelector('.e-icons').classList;
        }
        if (clsList.contains(CLS_POPUPICON) || clsList.contains(CLS_POPUPDOWN)) {
            this.popupClickHandler(ele, popupNav, CLS_RTL);
        }
        let clst: HTEle = <HTEle>closest(<Node>e.target, '.' + CLS_ITEM);
        if ((isNOU(clst) || clst.classList.contains(CLS_DISABLE)) && !popupNav.classList.contains(CLS_TBARNAV)) {
            return;
        }
        if (!isNOU(clst)) {
            trgParentDataIndex = parseInt(clst.getAttribute('data-index'), 10);
        }
        this.dotNetRef.invokeMethodAsync('TriggerClickEvent', e, isPopupElement, isCloseIcon, trgParentDataIndex);
    }
    private popupClickHandler(ele: HTMLElement, popupNav: HTMLElement, CLS_RTL: string): void {
        let popObj: Popup = this.popObj;
        if (isVisible(popObj.element)) {
            popupNav.classList.remove(CLS_TBARNAVACT);
            popObj.hide({ name: 'FadeOut', duration: 100 });
        } else {
            if (ele.classList.contains(CLS_RTL) || this.options.isVerticalLeft) {
                if (ele.classList.contains(CLS_RTL)) {
                    popObj.enableRtl = true;
                }
                popObj.position = { X: 'left', Y: 'top' };
            }
            if (popObj.offsetX === 0 && (!ele.classList.contains(CLS_RTL) && !this.options.isVerticalLeft)) {
                popObj.enableRtl = false;
                popObj.position = { X: 'right', Y: 'top' };
            }
            popObj.dataBind();
            popObj.refreshPosition();
            popObj.element.style.top = this.getElementOffsetY() + 'px';
            if (this.options.overflowMode === 'Extended') { popObj.element.style.minHeight = '0px'; }
            popupNav.classList.add(CLS_TBARNAVACT);
            popObj.show({ name: 'FadeIn', duration: 100 });
        }
    }
    public render(): void {
        this.scrollModule = null;
        this.popObj = null;
        this.isExtendedOpen = false;
        this.popupPriCount = 0;
        let width: string = formatUnit(this.options.width);
        let height: string = formatUnit(this.options.height);
        if (Browser.info.name !== 'msie' || this.options.height !== 'auto') {
            setStyle(this.element, { 'height': height });
        }
        setStyle(this.element, { 'width': width });
        this.element.setAttribute('aria-haspopup', 'false');
        this.renderControl();
        this.wireEvents();
    }
    private renderControl(): void {
        this.tbarAlgEle = { lefts: [], centers: [], rights: [] };
        this.renderItems();
        this.renderLayout();
    }
    private renderLayout(): void {
        this.renderOverflowMode();
        if (this.tbarAlign) { this.itemPositioning(); }
        if (this.popObj && this.popObj.element.childElementCount > 1 && this.checkPopupRefresh(this.element, this.popObj.element)) {
            this.popupRefresh(this.popObj.element, false);
        }
        this.separator();
    }
    private itemsAlign(items: ItemModel[], itemEleDom: HTEle): void {
        let innerItem: HTEle;
        let innerPos: HTEle;
        if (!this.tbarEle) {
            this.tbarEle = [];
        }
        for (let i: number = 0; i < items.length; i++) {
            let itemEleBlaDom: HTEle = this.element.querySelector('.' + BZ_ITEMS);
            innerItem = itemEleBlaDom.querySelector('.' + CLS_ITEM + '[data-index="' + i + '"]');
            if (!innerItem) {
                continue;
            }
            if (items[i].overflow !== 'Show' && items[i].showAlwaysInPopup && !innerItem.classList.contains(CLS_SEPARATOR)) {
                this.popupPriCount++;
            }
            if (items[i].htmlAttributes) {
                this.setAttr(items[i].htmlAttributes, innerItem);
            }
            if (items[i].type === 'Button') {
                EventHandler.clearEvents(innerItem);
                EventHandler.add(innerItem, 'click', this.itemClick, this);
            }
            if (this.tbarEle.indexOf(innerItem) === -1) {
                this.tbarEle.push(innerItem);
            }
            if (!this.tbarAlign) {
                this.tbarItemAlign(items[i], itemEleDom, i);
            }
            innerPos = <HTEle>itemEleDom.querySelector('.e-toolbar-' + items[i].align.toLowerCase());
            if (innerPos) {
                if (!(items[i].showAlwaysInPopup && items[i].overflow !== 'Show')) {
                    this.tbarAlgEle[(items[i].align + 's').toLowerCase() as ItmAlign].push(innerItem);
                }
                innerPos.appendChild(innerItem);
            } else {
                itemEleDom.appendChild(innerItem);
            }
        }
    }
    public serverItemsRefresh(): void {
        let wrapBlaEleDom: HTEle = <HTEle>this.element.querySelector('.' + BZ_ITEMS);
        if (wrapBlaEleDom.children.length > 0) {
            this.itemsAlign(this.options.items, this.element.querySelector('.' + CLS_ITEMS));
            this.renderLayout();
            this.refreshOverflow();
        }
    }
    public resetServerItems(): void {
        let wrapBlaEleDom: HTEle = <HTEle>this.element.querySelector('.' + BZ_ITEMS);
        let itemEles: HTEle[] = [].slice.call(selectAll('.' + CLS_ITEMS + ' .' + CLS_ITEM, this.element));
        append(itemEles, wrapBlaEleDom);
        this.clearProperty();
    }
    public changeOrientation(): void {
        if (!this.options.isVertical) {
            this.element.classList.remove(CLS_VERTICAL);
            this.element.setAttribute('aria-orientation', 'horizontal');
            if (this.options.height === 'auto' || this.options.height === '100%') {
                this.element.style.height = this.options.height;
            }
        } else {
            this.element.classList.add(CLS_VERTICAL);
            this.element.setAttribute('aria-orientation', 'vertical');
            setStyle(this.element, { 'height': formatUnit(this.options.height), 'width': formatUnit(this.options.width) });
        }
        this.destroyMode();
        this.refreshOverflow();
    }
    private initScroll(element: HTEle, innerItems: NodeList): void {
        if (!this.scrollModule && this.checkOverflow(element, <HTEle>innerItems[0])) {
            if (this.tbarAlign) {
                this.element.querySelector('.' + CLS_ITEMS + ' .' + CLS_TBARCENTER).removeAttribute('style');
            }
            if (this.options.isVertical) {
                this.scrollModule = new VScroll({ scrollStep: this.options.scrollStep, enableRtl: this.options.enableRtl }, <HTEle>innerItems[0]);
            } else {
                this.scrollModule = new HScroll({ scrollStep: this.options.scrollStep, enableRtl: this.options.enableRtl }, <HTEle>innerItems[0]);
            }
            removeClass([this.scrollModule.element], CLS_TBARPOS);
            setStyle(this.element, { overflow: 'hidden' });
        }
    }
    private itemWidthCal(items: HTEle): number {
        let width: number = 0;
        let style: CSSStyleDeclaration;
        [].slice.call(selectAll('.' + CLS_ITEM, items)).forEach((el: HTEle) => {
            if (isVisible(el)) {
                style = window.getComputedStyle(el);
                width += this.options.isVertical ? el.offsetHeight : el.offsetWidth;
                width += parseFloat(this.options.isVertical ? style.marginTop : style.marginRight);
                width += parseFloat(this.options.isVertical ? style.marginBottom : style.marginLeft);
            }
        });
        return width;
    }
    private getScrollCntEle(innerItem: HTEle): HTEle {
        let trgClass: string = (this.options.isVertical) ? '.e-vscroll-content' : '.e-hscroll-content';
        return <HTEle>innerItem.querySelector(trgClass);
    }
    private checkOverflow(element: HTEle, innerItem: HTEle): boolean {
        if (isNOU(element) || isNOU(innerItem) || !isVisible(element)) {
            return false;
        }
        let eleWidth: number = this.options.isVertical ? element.offsetHeight : element.offsetWidth;
        let itemWidth: number = this.options.isVertical ? innerItem.offsetHeight : innerItem.offsetWidth;
        if (this.tbarAlign || this.scrollModule || (eleWidth === itemWidth)) {
            itemWidth = this.itemWidthCal(this.scrollModule ? this.getScrollCntEle(innerItem) : innerItem);
        }
        let popNav: HTEle = <HTEle>element.querySelector('.' + CLS_TBARNAV);
        let scrollNav: HTEle = <HTEle>element.querySelector('.' + CLS_TBARSCRLNAV);
        let navEleWidth: number = 0;
        if (popNav) {
            navEleWidth = this.options.isVertical ? popNav.offsetHeight : popNav.offsetWidth;
        } else if (scrollNav) {
            navEleWidth = this.options.isVertical ? (scrollNav.offsetHeight * (2)) : (scrollNav.offsetWidth * 2);
        }
        if (itemWidth > eleWidth - navEleWidth) {
            return true;
        } else { return false; }
    }
    public refreshOverflow(): void {
        this.resize();
    }
    private toolbarAlign(innerItems: HTEle): void {
        if (this.tbarAlign) {
            addClass([innerItems], CLS_TBARPOS);
            this.itemPositioning();
        }
    }
    public renderOverflowMode(): void {
        let ele: HTEle = this.element;
        let innerItems: HTEle = <HTEle>ele.querySelector('.' + CLS_ITEMS);
        let priorityCheck: boolean = this.popupPriCount > 0;
        if (ele && ele.children.length > 0) {
            this.offsetWid = ele.offsetWidth;
            removeClass([this.element], 'e-toolpop');
            if (Browser.info.name === 'msie' && this.options.height === 'auto') {
                ele.style.height = '';
            }
            switch (this.options.overflowMode) {
                case 'Scrollable':
                    if (isNOU(this.scrollModule)) {
                        this.initScroll(ele, [].slice.call(ele.getElementsByClassName(CLS_ITEMS)));
                    }
                    break;
                case 'Popup':
                    addClass([this.element], 'e-toolpop');
                    if (this.tbarAlign) { this.removePositioning(); }
                    if (this.checkOverflow(ele, innerItems) || priorityCheck) {
                        this.setOverflowAttributes(ele);
                    }
                    this.toolbarAlign(innerItems);
                    break;
                case 'MultiRow':
                    addClass([innerItems], CLS_MULTIROW);
                    if (this.checkOverflow(ele, innerItems) && this.tbarAlign) {
                        this.removePositioning();
                        addClass([innerItems], CLS_MULTIROWPOS);
                    }
                    if (ele.style.overflow === 'hidden') {
                        ele.style.overflow = '';
                    }
                    if (Browser.info.name === 'msie' || ele.style.height !== 'auto') {
                        ele.style.height = 'auto';
                    }
                    break;
                case 'Extended':
                    addClass([this.element], CLS_EXTEANDABLE_TOOLBAR);
                    if (this.checkOverflow(ele, innerItems) || priorityCheck) {
                        if (this.tbarAlign) {
                            this.removePositioning();
                        }
                        this.setOverflowAttributes(ele);
                    }
                    this.toolbarAlign(innerItems);
            }
        }
    }
    private setOverflowAttributes(ele: HTMLElement): void {
        this.createPopupEle(ele, [].slice.call(selectAll('.' + CLS_ITEMS + ' .' + CLS_ITEM, ele)));
        this.element.querySelector('.' + CLS_TBARNAV).setAttribute('tabIndex', '0');
        this.element.querySelector('.' + CLS_TBARNAV).setAttribute('role', 'list');
    }
    private separator(): void {
        let element: HTEle = this.element;
        let eleItem: HTEle[] = [].slice.call(element.querySelectorAll('.' + CLS_SEPARATOR));
        let eleInlineItem: HTEle;
        let multiVar: HTEle = element.querySelector('.' + CLS_MULTIROW_SEPARATOR) as HTEle;
        let extendVar: HTEle = element.querySelector('.' + CLS_EXTENDABLE_SEPARATOR) as HTEle;
        eleInlineItem = this.options.overflowMode === 'MultiRow' ? multiVar : extendVar;
        if (eleInlineItem !== null) {
            if (this.options.overflowMode === 'MultiRow') {
                eleInlineItem.classList.remove(CLS_MULTIROW_SEPARATOR);
            } else if (this.options.overflowMode === 'Extended') {
                eleInlineItem.classList.remove(CLS_EXTENDABLE_SEPARATOR);
            }
        }
        for (let i: number = 0; i <= eleItem.length - 1; i++) {
            if (eleItem[i].offsetLeft < 30 && eleItem[i].offsetLeft !== 0) {
                if (this.options.overflowMode === 'MultiRow') {
                    eleItem[i].classList.add(CLS_MULTIROW_SEPARATOR);
                } else if (this.options.overflowMode === 'Extended') {
                    eleItem[i].classList.add(CLS_EXTENDABLE_SEPARATOR);
                }
            }
        }
    }
    private createPopupEle(ele: HTMLElement, innerEle: HTMLElement[]): void {
        let innerNav: HTEle = <HTEle>ele.querySelector('.' + CLS_TBARNAV);
        let vertical: boolean = this.options.isVertical;
        if (!innerNav) {
            this.createPopupIcon(ele);
        }
        innerNav = <HTEle>ele.querySelector('.' + CLS_TBARNAV);
        let innerNavDom: number = (vertical ? innerNav.offsetHeight : innerNav.offsetWidth);
        let eleWidth: number = ((vertical ? ele.offsetHeight : ele.offsetWidth) - (innerNavDom));
        this.element.classList.remove('e-rtl');
        setStyle(this.element, { direction: 'initial' });
        this.checkPriority(ele, innerEle, eleWidth, true);
        if (this.options.enableRtl) {
            this.element.classList.add('e-rtl');
        }
        this.element.style.removeProperty('direction');
        this.createPopup();
    }
    private pushingPoppedEle(tbarObj: SfToolbar, popupPri: Element[], ele: HTEle, eleHeight: number, sepHeight: number): void {
        let element: HTEle = this.element;
        let nodes: HTEle[] = selectAll('.' + CLS_TBAROVERFLOW, ele);
        let nodeIndex: number = 0;
        let poppedEle: HTEle[] = [].slice.call(selectAll('.' + CLS_POPUP, element.querySelector('.' + CLS_ITEMS)));
        let nodePri: number = 0;
        poppedEle.forEach((el: HTEle, index: number) => {
            nodes = selectAll('.' + CLS_TBAROVERFLOW, ele);
            if (el.classList.contains(CLS_TBAROVERFLOW) && nodes.length > 0) {
                if (tbarObj.tbResize && nodes.length > index) {
                    ele.insertBefore(el, nodes[index]); ++nodePri;
                } else { ele.insertBefore(el, ele.children[nodes.length]); ++nodePri; }
            } else if (el.classList.contains(CLS_TBAROVERFLOW)) {
                ele.insertBefore(el, ele.firstChild); ++nodePri;
            } else if (tbarObj.tbResize && el.classList.contains(CLS_POPOVERFLOW) && ele.children.length > 0 && nodes.length === 0) {
                ele.insertBefore(el, ele.firstChild); ++nodePri;
            } else if (el.classList.contains(CLS_POPOVERFLOW)) {
                popupPri.push(el);
            } else if (tbarObj.tbResize) {
                ele.insertBefore(el, ele.childNodes[nodeIndex + nodePri]);
                ++nodeIndex;
            } else {
                ele.appendChild(el);
            }
            if (el.classList.contains(CLS_SEPARATOR)) {
                setStyle(el, { display: '', height: sepHeight + 'px' });
            } else {
                setStyle(el, { display: '', height: eleHeight + 'px' });
            }
        });
        popupPri.forEach((el: Element) => {
            ele.appendChild(el);
        });
        let tbarEle: HTEle[] = selectAll('.' + CLS_ITEM, element.querySelector('.' + CLS_ITEMS));
        for (let i: number = tbarEle.length - 1; i >= 0; i--) {
            let tbarElement: HTEle = tbarEle[i];
            if (tbarElement.classList.contains(CLS_SEPARATOR) && this.options.overflowMode !== 'Extended') {
                setStyle(tbarElement, { display: 'none' });
            } else {
                break;
            }
        }
    }
    private createPopup(): void {
        let element: HTEle = this.element;
        let eleHeight: number;
        let eleItem: Element;
        let sepHeight: number;
        let sepItem: Element;
        if (this.options.overflowMode === 'Extended') {
            sepItem = element.querySelector('.' + CLS_SEPARATOR + ':not(.' + CLS_POPUP + ')');
            sepHeight = (element.style.height === 'auto' || element.style.height === '') ? null : (sepItem && (sepItem as HTEle).offsetHeight);
        }
        eleItem = element.querySelector('.' + CLS_ITEM + ':not(.' + CLS_SEPARATOR + '):not(.' + CLS_POPUP + ')');
        eleHeight = (element.style.height === 'auto' || element.style.height === '') ? null : (eleItem && (eleItem as HTEle).offsetHeight);
        let ele: HTEle;
        let popupPri: Element[] = [];
        if (element.querySelector('#' + element.id + '_popup.' + CLS_POPUPCLASS)) {
            ele = <HTEle>element.querySelector('#' + element.id + '_popup.' + CLS_POPUPCLASS);
        } else {
            let extendEle: HTEle = createElement('div', {
                id: element.id + '_popup', className: CLS_POPUPCLASS + ' ' + CLS_EXTENDABLECLASS
            });
            let popupEle: HTEle = createElement('div', { id: element.id + '_popup', className: CLS_POPUPCLASS });
            ele = this.options.overflowMode === 'Extended' ? extendEle : popupEle;
        }
        this.pushingPoppedEle(this, popupPri, ele, eleHeight, sepHeight);
        this.popupInit(element, ele);
    }
    private getElementOffsetY(): number {
        return (this.options.overflowMode === 'Extended' && window.getComputedStyle(this.element).getPropertyValue('box-sizing') === 'border-box' ?
            this.element.clientHeight : this.element.offsetHeight);
    }
    private popupInit(element: HTEle, ele: HTEle): void {
        if (!this.popObj) {
            element.appendChild(ele);
            setStyle(this.element, { overflow: '' });
            let eleStyles: CSSStyleDeclaration = window.getComputedStyle(this.element);
            let popup: Popup = new Popup(null, {
                relateTo: this.element,
                offsetY: (this.options.isVertical) ? 0 : this.getElementOffsetY(),
                enableRtl: this.options.enableRtl,
                open: this.popupOpen.bind(this),
                close: this.popupClose.bind(this),
                collision: { Y: this.options.enableCollision ? 'flip' : 'none' },
                position: this.options.enableRtl ? { X: 'left', Y: 'top' } : { X: 'right', Y: 'top' }
            });
            popup.appendTo(ele);
            if (this.options.overflowMode === 'Extended') {
                popup.width = parseFloat(eleStyles.width) + ((parseFloat(eleStyles.borderRightWidth)) * 2);
                popup.offsetX = 0;
            }
            EventHandler.add(document, 'scroll', this.docEvent.bind(this));
            EventHandler.add(document, 'click ', this.docEvent.bind(this));
            popup.element.style.maxHeight = popup.element.offsetHeight + 'px';
            if (this.options.isVertical) { popup.element.style.visibility = 'hidden'; }
            if (this.isExtendedOpen) {
                let popupNav: HTEle = this.element.querySelector('.' + CLS_TBARNAV);
                popupNav.classList.add(CLS_TBARNAVACT);
                classList(popupNav.firstElementChild, [CLS_POPUPICON], [CLS_POPUPDOWN]);
                this.element.querySelector('.' + CLS_EXTENDABLECLASS).classList.add(CLS_POPUPOPEN);
            } else {
                popup.hide();
            }
            this.popObj = popup;
            this.element.setAttribute('aria-haspopup', 'true');
        } else {
            let popupEle: HTEle = this.popObj.element;
            setStyle(popupEle, { maxHeight: '', display: 'block' });
            setStyle(popupEle, { maxHeight: popupEle.offsetHeight + 'px', display: '' });
        }
    }
    private tbarPopupHandler(isOpen: boolean): void {
        if (this.options.overflowMode === 'Extended') {
            isOpen ? addClass([this.element], CLS_EXTENDEDPOPOPEN) : removeClass([this.element], CLS_EXTENDEDPOPOPEN);
        }
    }
    private popupOpen(e: Event): void {
        let popObj: Popup = this.popObj;
        if (!this.options.isVertical) {
            popObj.offsetY = this.getElementOffsetY();
            popObj.dataBind();
        }
        let popupEle: HTEle = this.popObj.element;
        let toolEle: HTEle = this.popObj.element.parentElement;
        let popupNav: HTEle = <HTEle>toolEle.querySelector('.' + CLS_TBARNAV);
        setStyle(popObj.element, { height: 'auto', maxHeight: '' });
        popObj.element.style.maxHeight = popObj.element.offsetHeight + 'px';
        if (this.options.overflowMode === 'Extended') { popObj.element.style.minHeight = ''; }
        let popupElePos: number = popupEle.offsetTop + popupEle.offsetHeight + calculatePosition(toolEle).top;
        let popIcon: Element = (popupNav.firstElementChild as Element);
        popupNav.classList.add(CLS_TBARNAVACT);
        classList(popIcon, [CLS_POPUPICON], [CLS_POPUPDOWN]);
        this.tbarPopupHandler(true);
        let scrollVal: number = isNOU(window.scrollY) ? 0 : window.scrollY;
        if (!this.options.isVertical && ((window.innerHeight + scrollVal) < popupElePos) && (this.element.offsetTop < popupEle.offsetHeight)) {
            let overflowHeight: number = (popupEle.offsetHeight - ((popupElePos - window.innerHeight - scrollVal) + 5));
            popObj.height = overflowHeight + 'px';
            for (let i: number = 0; i <= popupEle.childElementCount; i++) {
                let ele: HTEle = <HTEle>popupEle.children[i];
                if (ele.offsetTop + ele.offsetHeight > overflowHeight) {
                    overflowHeight = ele.offsetTop;
                    break;
                }
            }
            setStyle(popObj.element, { maxHeight: overflowHeight + 'px' });
        } else if (this.options.isVertical) {
            let tbEleData: ClientRect = this.element.getBoundingClientRect();
            setStyle(popObj.element, { maxHeight: (tbEleData.top + this.element.offsetHeight) + 'px', bottom: 0, visibility: '' });
        }
        if (popObj) {
            popObj.refreshPosition();
        }
    }
    private popupClose(e: Event): void {
        let element: HTEle = this.element;
        let popupNav: HTEle = <HTEle>element.querySelector('.' + CLS_TBARNAV);
        let popIcon: Element = (popupNav.firstElementChild as Element);
        popupNav.classList.remove(CLS_TBARNAVACT);
        classList(popIcon, [CLS_POPUPDOWN], [CLS_POPUPICON]);
        this.tbarPopupHandler(false);
    }
    private checkPriority(ele: HTEle, inEle: HTEle[], eleWidth: number, pre: boolean): void {
        let popPriority: boolean = this.popupPriCount > 0;
        let len: number = inEle.length;
        let eleWid: number = eleWidth;
        let eleOffset: number;
        let checkoffset: boolean;
        let sepCheck: number = 0; let itemCount: number = 0; let itemPopCount: number = 0;
        let checkClass: Function = (ele: HTEle, val: string[]) => {
            let rVal: Boolean = false;
            val.forEach((cls: string) => {
                if (ele.classList.contains(cls)) {
                    rVal = true;
                }
            });
            return rVal;
        };
        for (let i: number = len - 1; i >= 0; i--) {
            let mrgn: number;
            let compuStyle: CSSStyleDeclaration = window.getComputedStyle(inEle[i]);
            if (this.options.isVertical) {
                mrgn = parseFloat((compuStyle).marginTop);
                mrgn += parseFloat((compuStyle).marginBottom);
            } else {
                mrgn = parseFloat((compuStyle).marginRight);
                mrgn += parseFloat((compuStyle).marginLeft);
            }
            let fstEleCheck: Boolean = inEle[i] === this.tbarEle[0];
            if (fstEleCheck) { this.tbarEleMrgn = mrgn; }
            eleOffset = this.options.isVertical ? inEle[i].offsetHeight : inEle[i].offsetWidth;
            let eleWid: number = fstEleCheck ? (eleOffset + mrgn) : eleOffset;
            if (checkClass(inEle[i], [CLS_POPPRI]) && popPriority) {
                inEle[i].classList.add(CLS_POPUP);
                if (this.options.isVertical) {
                    setStyle(inEle[i], { display: 'none', minHeight: eleWid + 'px' });
                } else {
                    setStyle(inEle[i], { display: 'none', minWidth: eleWid + 'px' });
                }
                itemPopCount++;
            }
            if (this.options.isVertical) {
                checkoffset = (inEle[i].offsetTop + inEle[i].offsetHeight + mrgn) > eleWidth;
            } else {
                checkoffset = (inEle[i].offsetLeft + inEle[i].offsetWidth + mrgn) > eleWidth;
            }
            if (checkoffset) {
                if (inEle[i].classList.contains(CLS_SEPARATOR)) {
                    if (this.options.overflowMode === 'Extended') {
                        if (itemCount === itemPopCount) {
                            let sepEle: HTEle = (inEle[i] as HTEle);
                            if (checkClass(sepEle, [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                                inEle[i].classList.add(CLS_POPUP);
                                itemPopCount++;
                            }
                        }
                        itemCount++;
                    } else if (this.options.overflowMode === 'Popup') {
                        if (sepCheck > 0 && itemCount === itemPopCount) {
                            let sepEle: HTEle = (inEle[i + itemCount + (sepCheck - 1)] as HTEle);
                            if (checkClass(sepEle, [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                                setStyle(sepEle, { display: 'none' });
                            }
                        }
                        sepCheck++; itemCount = 0; itemPopCount = 0;
                    }
                } else {
                    itemCount++;
                }
                if (inEle[i].classList.contains(CLS_TBAROVERFLOW) && pre) {
                    eleWidth -= ((this.options.isVertical ? inEle[i].offsetHeight : inEle[i].offsetWidth) + (mrgn));
                } else if (!checkClass(inEle[i], [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                    inEle[i].classList.add(CLS_POPUP);
                    if (this.options.isVertical) {
                        setStyle(inEle[i], { display: 'none', minHeight: eleWid + 'px' });
                    } else {
                        setStyle(inEle[i], { display: 'none', minWidth: eleWid + 'px' });
                    }
                    itemPopCount++;
                } else {
                    eleWidth -= ((this.options.isVertical ? inEle[i].offsetHeight : inEle[i].offsetWidth) + (mrgn));
                }
            }
        }
        if (pre) {
            let popedEle: HTEle[] = selectAll('.' + CLS_ITEM + ':not(.' + CLS_POPUP + ')', this.element);
            this.checkPriority(ele, popedEle, eleWid, false);
        }
    }
    private createPopupIcon(element: HTEle): void {
        let id: string = element.id.concat('_nav');
        let className: string = 'e-' + element.id.concat('_nav ' + CLS_POPUPNAV);
        className = this.options.overflowMode === 'Extended' ? className + ' ' + CLS_EXTENDPOPUP : className;
        let nav: HTEle = createElement('div', { id: id, className: className });
        if (Browser.info.name === 'msie' || Browser.info.name === 'edge') {
            nav.classList.add('e-ie-align');
        }
        let navItem: HTEle = createElement('div', { className: CLS_POPUPDOWN + ' e-icons' });
        nav.appendChild(navItem);
        nav.setAttribute('tabindex', '0');
        nav.setAttribute('role', 'list');
        element.appendChild(nav);
    }
    private tbarPriRef(inEle: HTEle, indx: number, sepPri: number, el: HTEle, des: boolean, elWid: number, wid: number, ig: number): void {
        let ignoreCount: number = ig;
        let popEle: HTEle = this.popObj.element;
        let query: string = '.' + CLS_ITEM + ':not(.' + CLS_SEPARATOR + '):not(.' + CLS_TBAROVERFLOW + ')';
        let priEleCnt: number = selectAll('.' + CLS_POPUP + ':not(.' + CLS_TBAROVERFLOW + ')', popEle).length;
        let checkClass: Function = (ele: HTEle, val: string) => {
            return ele.classList.contains(val);
        };
        if (selectAll(query, inEle).length === 0) {
            let eleSep: HTEle = inEle.children[indx - (indx - sepPri) - 1] as HTEle;
            let ignoreCheck: Boolean = (!isNOU(eleSep) && checkClass(eleSep, CLS_TBARIGNORE));
            if ((!isNOU(eleSep) && checkClass(eleSep, CLS_SEPARATOR) && !isVisible(eleSep)) || ignoreCheck) {
                let sepDisplay: string = 'none';
                eleSep.style.display = 'inherit';
                let eleSepWidth: number = eleSep.offsetWidth + (parseFloat(window.getComputedStyle(eleSep).marginRight) * 2);
                let prevSep: HTEle = eleSep.previousElementSibling as HTEle;
                if ((elWid + eleSepWidth) < wid || des) {
                    inEle.insertBefore(el, inEle.children[(indx + ignoreCount) - (indx - sepPri)]);
                    if (!isNOU(prevSep)) {
                        prevSep.style.display = '';
                    }
                } else {
                    if (prevSep.classList.contains(CLS_SEPARATOR)) {
                        prevSep.style.display = sepDisplay;
                    }
                }
                eleSep.style.display = '';
            } else {
                inEle.insertBefore(el, inEle.children[(indx + ignoreCount) - (indx - sepPri)]);
            }
        } else {
            inEle.insertBefore(el, inEle.children[(indx + ignoreCount) - priEleCnt]);
        }
    }
    public popupRefresh(popupEle: HTMLElement, destroy: boolean): void {
        let ele: HTEle = this.element;
        let isVer: boolean = this.options.isVertical;
        let popNav: HTEle = <HTEle>ele.querySelector('.' + CLS_TBARNAV);
        let innerEle: HTEle = <HTEle>ele.querySelector('.' + CLS_ITEMS);
        if (isNOU(popNav)) {
            return;
        }
        innerEle.removeAttribute('style');
        popupEle.style.display = 'block';
        let dimension: number;
        if (isVer) {
            dimension = ele.offsetHeight - (popNav.offsetHeight + innerEle.offsetHeight);
        } else {
            dimension = ele.offsetWidth - (popNav.offsetWidth + innerEle.offsetWidth);
        }
        let popupEleWidth: number = 0;
        [].slice.call(popupEle.children).forEach((el: HTMLElement): void => {
            popupEleWidth += this.popupEleWidth(el);
            setStyle(el, { 'position': '' });
        });
        if ((dimension + (isVer ? popNav.offsetHeight : popNav.offsetWidth)) > (popupEleWidth) && this.popupPriCount === 0) {
            destroy = true;
        }
        this.popupEleRefresh(dimension, popupEle, destroy);
        popupEle.style.display = '';
        if (popupEle.children.length === 0 && popNav && this.popObj) {
            detach(popNav);
            popNav = null;
            this.popObj.destroy();
            detach(this.popObj.element);
            this.popObj = null;
            ele.setAttribute('aria-haspopup', 'false');
        }
    }
    private ignoreEleFetch(index: number, innerEle: HTEle): number {
        let ignoreEle: HTEle[] = [].slice.call(innerEle.querySelectorAll('.' + CLS_TBARIGNORE));
        let ignoreInx: number[] = [];
        let count: number = 0;
        if (ignoreEle.length > 0) {
            ignoreEle.forEach((ele: HTEle): void => {
                ignoreInx.push([].slice.call(innerEle.children).indexOf(ele));
            });
        } else {
            return 0;
        }
        ignoreInx.forEach((val: number): void => {
            if (val <= index) { count++; }
        });
        return count;
    }
    private checkPopupRefresh(root: HTEle, popEle: HTEle): boolean {
        popEle.style.display = 'block';
        let elWid: number = this.popupEleWidth(<HTEle>popEle.firstElementChild);
        (<HTEle>popEle.firstElementChild).style.removeProperty('Position');
        let tbarWidth: number = root.offsetWidth - (<HTEle>root.querySelector('.' + CLS_TBARNAV)).offsetWidth;
        let tbarItemsWid: number = (<HTEle>root.querySelector('.' + CLS_ITEMS)).offsetWidth;
        popEle.style.removeProperty('display');
        if (tbarWidth > (elWid + tbarItemsWid)) {
            return true;
        }
        return false;
    }
    private popupEleWidth(el: HTEle): number {
        el.style.position = 'absolute';
        let elWidth: number = this.options.isVertical ? el.offsetHeight : el.offsetWidth;
        let btnText: HTEle = <HTEle>el.querySelector('.' + CLS_TBARBTNTEXT);
        if (el.classList.contains('e-tbtn-align') || el.classList.contains(CLS_TBARTEXT)) {
            let btn: HTEle = <HTEle>el.children[0];
            if (!isNOU(btnText) && el.classList.contains(CLS_TBARTEXT)) {
                btnText.style.display = 'none';
            } else if (!isNOU(btnText) && el.classList.contains(CLS_POPUPTEXT)) {
                btnText.style.display = 'block';
            }
            btn.style.minWidth = '0%';
            elWidth = parseFloat(!this.options.isVertical ? el.style.minWidth : el.style.minHeight);
            btn.style.minWidth = '';
            btn.style.minHeight = '';
            if (!isNOU(btnText)) {
                btnText.style.display = '';
            }
        }
        return elWidth;
    }
    private popupEleRefresh(width: number, popupEle: HTEle, destroy: boolean): void {
        let popPriority: boolean = this.popupPriCount > 0;
        let eleSplice: HTEle[] = this.tbarEle;
        let priEleCnt: number;
        let index: number;
        let checkOverflow: boolean;
        let innerEle: HTEle = <HTEle>this.element.querySelector('.' + CLS_ITEMS);
        let ignoreCount: number = 0;
        for (let el of [].slice.call(popupEle.children)) {
            if (el.classList.contains(CLS_POPPRI) && popPriority && !destroy) {
                continue;
            }
            let elWidth: number = this.popupEleWidth(el);
            if (el === this.tbarEle[0]) { elWidth += this.tbarEleMrgn; }
            el.style.position = '';
            if (elWidth < width || destroy) {
                setStyle(el, { minWidth: '', height: '', minHeight: '' });
                if (!el.classList.contains(CLS_POPOVERFLOW)) {
                    el.classList.remove(CLS_POPUP);
                }
                index = this.tbarEle.indexOf(el);
                if (this.tbarAlign) {
                    let pos: ItemAlign = this.options.items[index].align;
                    index = this.tbarAlgEle[(pos + 's').toLowerCase() as ItmAlign].indexOf(el);
                    eleSplice = this.tbarAlgEle[(pos + 's').toLowerCase() as ItmAlign];
                    innerEle = <HTEle>this.element.querySelector('.' + CLS_ITEMS + ' .' + 'e-toolbar-' + pos.toLowerCase());
                }
                let sepBeforePri: number = 0;
                if (this.options.overflowMode !== 'Extended') {
                    eleSplice.slice(0, index).forEach((el: HTEle) => {
                        if (el.classList.contains(CLS_TBAROVERFLOW) || el.classList.contains(CLS_SEPARATOR)) {
                            if (el.classList.contains(CLS_SEPARATOR)) {
                                el.style.display = '';
                                width -= el.offsetWidth;
                            }
                            sepBeforePri++;
                        }
                    });
                }
                ignoreCount = this.ignoreEleFetch(index, innerEle);
                if (el.classList.contains(CLS_TBAROVERFLOW)) {
                    this.tbarPriRef(innerEle, index, sepBeforePri, el, destroy, elWidth, width, ignoreCount);
                    width -= el.offsetWidth;
                } else if (index === 0) {
                    innerEle.insertBefore(el, innerEle.firstChild);
                    width -= el.offsetWidth;
                } else {
                    priEleCnt = selectAll('.' + CLS_TBAROVERFLOW, this.popObj.element).length;
                    innerEle.insertBefore(el, innerEle.children[(index + ignoreCount) - priEleCnt]);
                    width -= el.offsetWidth;
                }
                el.style.height = '';
            } else {
                break;
            }
        }
        checkOverflow = this.checkOverflow(this.element, this.element.getElementsByClassName(CLS_ITEMS)[0] as HTEle);
        if (checkOverflow && !destroy) {
            this.renderOverflowMode();
        }
    }
    private removePositioning(): void {
        let item: HTEle = this.element.querySelector('.' + CLS_ITEMS) as HTEle;
        if (isNOU(item) || !item.classList.contains(CLS_TBARPOS)) { return; }
        removeClass([item], CLS_TBARPOS);
        let innerItem: HTEle[] = [].slice.call(item.childNodes);
        innerItem[1].removeAttribute('style');
        innerItem[2].removeAttribute('style');
    }
    private refreshPositioning(): void {
        let item: HTEle = this.element.querySelector('.' + CLS_ITEMS) as HTEle;
        addClass([item], CLS_TBARPOS);
        this.itemPositioning();
    }
    public itemPositioning(): void {
        let item: HTEle = this.element.querySelector('.' + CLS_ITEMS) as HTEle;
        let margin: number;
        if (isNOU(item) || !item.classList.contains(CLS_TBARPOS)) { return; }
        let popupNav: HTEle = <HTEle>this.element.querySelector('.' + CLS_TBARNAV);
        let innerItem: HTEle[];
        if (this.scrollModule) {
            let trgClass: string = (this.options.isVertical) ? CLS_VSCROLLCNT : CLS_HSCROLLCNT;
            innerItem = [].slice.call(item.querySelector('.' + trgClass).children);
        } else {
            innerItem = [].slice.call(item.childNodes);
        }
        if (this.options.isVertical) {
            margin = innerItem[0].offsetHeight + innerItem[2].offsetHeight;
        } else {
            margin = innerItem[0].offsetWidth + innerItem[2].offsetWidth;
        }
        let tbarWid: number = this.options.isVertical ? this.element.offsetHeight : this.element.offsetWidth;
        if (popupNav) {
            tbarWid -= (this.options.isVertical ? popupNav.offsetHeight : popupNav.offsetWidth);
            let popWid: string = (this.options.isVertical ? popupNav.offsetHeight : popupNav.offsetWidth) + 'px';
            innerItem[2].removeAttribute('style');
            if (this.options.isVertical) {
                this.options.enableRtl ? innerItem[2].style.top = popWid : innerItem[2].style.bottom = popWid;
            } else {
                this.options.enableRtl ? innerItem[2].style.left = popWid : innerItem[2].style.right = popWid;
            }
        }
        if (tbarWid <= margin) { return; }
        let value: number = (((tbarWid - margin)) - (!this.options.isVertical ? innerItem[1].offsetWidth : innerItem[1].offsetHeight)) / 2;
        innerItem[1].removeAttribute('style');
        let mrgn: string = ((!this.options.isVertical ? innerItem[0].offsetWidth : innerItem[0].offsetHeight) + value) + 'px';
        if (this.options.isVertical) {
            this.options.enableRtl ? innerItem[1].style.marginBottom = mrgn : innerItem[1].style.marginTop = mrgn;
        } else {
            this.options.enableRtl ? innerItem[1].style.marginRight = mrgn : innerItem[1].style.marginLeft = mrgn;
        }
    }
    private tbarItemAlign(item: ItemModel, itemEle: HTEle, pos: number): void {
        if (item.showAlwaysInPopup && item.overflow !== 'Show') { return; }
        let alignDiv: HTMLElement[] = [];
        alignDiv.push(createElement('div', { className: CLS_TBARLEFT }));
        alignDiv.push(createElement('div', { className: CLS_TBARCENTER }));
        alignDiv.push(createElement('div', { className: CLS_TBARRIGHT }));
        if (pos === 0 && item.align !== 'Left') {
            alignDiv.forEach((ele: HTEle) => {
                itemEle.appendChild(ele);
            });
            this.tbarAlign = true;
            addClass([itemEle], CLS_TBARPOS);
        } else if (item.align !== 'Left') {
            let alignEle: NodeList = itemEle.childNodes;
            let leftAlign: HTEle = alignDiv[0];
            [].slice.call(alignEle).forEach((el: HTEle) => {
                this.tbarAlgEle.lefts.push(el);
                leftAlign.appendChild(el);
            });
            itemEle.appendChild(leftAlign);
            itemEle.appendChild(alignDiv[1]);
            itemEle.appendChild(alignDiv[2]);
            this.tbarAlign = true;
            addClass([itemEle], CLS_TBARPOS);
        }
    }
    private renderItems(): void {
        let ele: HTEle = this.element;
        let items: ItemModel[] = <ItemModel[]>this.options.items;
        if (ele && items.length > 0) {
            let itemEleDom: HTEle = <HTEle>ele.querySelector('.' + CLS_ITEMS);
            if (!itemEleDom) {
                itemEleDom = createElement('div', { className: CLS_ITEMS });
            }
            this.itemsAlign(items, itemEleDom);
            if (!isNOU(ele.firstElementChild)) {
                ele.insertBefore(itemEleDom, ele.firstElementChild);
            } else {
                ele.appendChild(itemEleDom);
            }
        }
    }
    private setAttr(attr: { [key: string]: string; }, element: HTEle): void {
        let key: Object[] = Object.keys(attr);
        let keyVal: string;
        for (let i: number = 0; i < key.length; i++) {
            keyVal = key[i] as string;
            keyVal === 'class' ? addClass([element], attr[keyVal]) : element.setAttribute(keyVal, attr[keyVal]);
        }
    }
    private itemClick(e: Event): void {
        this.activeEleSwitch(<HTEle>e.currentTarget);
    }
    private activeEleSwitch(ele: HTEle): void {
        this.activeEleRemove(<HTEle>ele.firstElementChild);
        this.activeEle.focus();
    }
    private activeEleRemove(curEle: HTEle): void {
        if (!isNOU(this.activeEle)) {
            this.activeEle.setAttribute('tabindex', '-1');
        }
        this.activeEle = curEle;
        if (isNOU(this.trgtEle) && !(<HTEle>curEle.parentElement).classList.contains(CLS_TEMPLATE)) {
            curEle.removeAttribute('tabindex');
        } else {
            this.activeEle.setAttribute('tabindex', '0');
        }
    }
    private resize(): void {
        let ele: HTEle = this.element;
        this.tbResize = true;
        if (this.tbarAlign) { this.itemPositioning(); }
        if (this.popObj && this.options.overflowMode === 'Popup') {
            this.popObj.hide();
        }
        let checkOverflow: boolean = this.checkOverflow(ele, ele.getElementsByClassName(CLS_ITEMS)[0] as HTEle);
        if (!checkOverflow) {
            this.destroyScroll();
            let multirowele: HTEle = ele.querySelector('.' + CLS_ITEMS);
            if (!isNOU(multirowele)) {
                removeClass([multirowele], CLS_MULTIROWPOS);
                if (this.tbarAlign) { addClass([multirowele], CLS_TBARPOS); }
            }
        }
        if (checkOverflow && this.scrollModule && (this.offsetWid === ele.offsetWidth)) { return; }
        if (this.offsetWid > ele.offsetWidth || checkOverflow) {
            this.renderOverflowMode();
        }
        if (this.popObj) {
            if (this.options.overflowMode === 'Extended') {
                let eleStyles: CSSStyleDeclaration = window.getComputedStyle(this.element);
                this.popObj.width = parseFloat(eleStyles.width) + ((parseFloat(eleStyles.borderRightWidth)) * 2);
            }
            if (this.tbarAlign) { this.removePositioning(); }
            this.popupRefresh(this.popObj.element, false);
            if (this.tbarAlign) { this.refreshPositioning(); }
        }
        this.offsetWid = ele.offsetWidth;
        this.tbResize = false;
        this.separator();
    }
    public extendedOpen(): void {
        let sib: HTEle = this.element.querySelector('.' + CLS_EXTENDABLECLASS) as HTEle;
        if (this.options.overflowMode === 'Extended' && sib) {
            this.isExtendedOpen = sib.classList.contains(CLS_POPUPOPEN);
        }
    }
    public disable(value: boolean): void {
        let rootEle: HTMLElement = this.element;
        value ? rootEle.classList.add(CLS_DISABLE) : rootEle.classList.remove(CLS_DISABLE);
        rootEle.setAttribute('tabindex', !value ? '0' : '-1');
        if (this.activeEle) {
            this.activeEle.setAttribute('tabindex', !value ? '0' : '-1');
        }
        if (this.scrollModule) {
            this.scrollModule.disable(value);
        }
        if (this.popObj) {
            if (isVisible(this.popObj.element) && this.options.overflowMode !== 'Extended') {
                this.popObj.hide();
            }
            rootEle.querySelector('#' + rootEle.id + '_nav').setAttribute('tabindex', !value ? '0' : '-1');
        }
    }
    public setCssClass(cssClass: string): void {
        this.extendedOpen();
        if (this.options.cssClass) { removeClass([this.element], this.options.cssClass.split(' ')); }
        if (cssClass) { addClass([this.element], cssClass.split(' ')); }
        this.options.cssClass = cssClass;
    }
}

interface IToolbarOptions {
    items: ItemModel[];
    width: string;
    height: string;
    cssClass: string;
    overflowMode: OverflowMode;
    scrollStep: number;
    enableCollision: boolean;
    allowKeyboard: boolean;
    enableRtl: boolean;
    isVertical: boolean;
    isVerticalLeft: boolean;
}

interface BlazorToolbarElement extends HTMLElement {
    blazor__instance: SfToolbar;
}

// tslint:disable
let Toolbar: object = {
    initialize(element: BlazorToolbarElement, options: IToolbarOptions, dotnetRef: BlazorDotnetObject): void {
        if (options.scrollStep === 0) {
            options.scrollStep = null;
        }
        let instance: SfToolbar = new SfToolbar(element, options, dotnetRef);
        instance.render();
        instance.dotNetRef.invokeMethodAsync("CreatedEvent", null);
    },
    hidePopup(element: BlazorToolbarElement): void {
        if (!isNOU(element) && !isNOU(element.blazor__instance) && !isNOU(element.blazor__instance.popObj)) {
            element.blazor__instance.popObj.hide({ name: 'FadeOut', duration: 100 });
        }
    },
    setCssClass(element: BlazorToolbarElement, cssClass: string): void {
        if (!isNOU(element) && !isNOU(element.blazor__instance)) {
            element.blazor__instance.setCssClass(cssClass);
        }
    },
    setWidth(element: BlazorToolbarElement, width: string): void {
        if (!isNOU(element) && !isNOU(element.blazor__instance)) {
            element.blazor__instance.options.width = width;
            element.blazor__instance.extendedOpen();
            let wid: number = element.offsetWidth;
            setStyle(element, { 'width': formatUnit(width) });
            element.blazor__instance.renderOverflowMode();
            if (element.blazor__instance.popObj && wid < element.offsetWidth) {
                element.blazor__instance.popupRefresh(element.blazor__instance.popObj.element, false);
            }
        }
    },
    setHeight(element: BlazorToolbarElement, height: string): void {
        if (!isNOU(element) && !isNOU(element.blazor__instance)) {
            element.blazor__instance.options.height = height;
            element.blazor__instance.extendedOpen();
            setStyle(element, { 'height': formatUnit(height) });
        }
    },
    setOverflowMode(element: BlazorToolbarElement, overflowMode: OverflowMode) {
        if (!isNOU(element) && !isNOU(element.blazor__instance)) {
            element.blazor__instance.options.overflowMode = overflowMode;
            element.blazor__instance.extendedOpen();
            element.blazor__instance.destroyMode();
            element.blazor__instance.renderOverflowMode();
            if (element.blazor__instance.options.enableRtl) {
                addClass([element], CLS_RTL);
            }
            element.blazor__instance.refreshOverflow();
        }
    },
    setEnableRTL(element: BlazorToolbarElement, enableRtl: boolean): void {
        if (!isNOU(element) && !isNOU(element.blazor__instance)) {
            element.blazor__instance.options.enableRtl = enableRtl;
            element.blazor__instance.extendedOpen();
            enableRtl ? addClass([element], CLS_RTL) : removeClass([element], CLS_RTL);
            if (!isNOU(element.blazor__instance.scrollModule)) {
                enableRtl ? addClass([element.blazor__instance.scrollModule.element], CLS_RTL) : removeClass([element.blazor__instance.scrollModule.element], CLS_RTL);
            }
            if (!isNOU(element.blazor__instance.popObj)) {
                enableRtl ? addClass([element.blazor__instance.popObj.element], CLS_RTL) : removeClass([element.blazor__instance.popObj.element], CLS_RTL);
            }
            if (element.blazor__instance.tbarAlign) { element.blazor__instance.itemPositioning(); }
        }
    },
    setScrollStep(element: BlazorToolbarElement, scrollStep: number): void {
        if (!isNOU(element) && !isNOU(element.blazor__instance)) {
            element.blazor__instance.options.scrollStep = scrollStep;
            element.blazor__instance.extendedOpen();
            if (element.blazor__instance.scrollModule) {
                element.blazor__instance.scrollModule.scrollStep = scrollStep;
            }
        }
    },
    setEnableCollision(element: BlazorToolbarElement, enableCollision: boolean): void {
        if (!isNOU(element) && !isNOU(element.blazor__instance)) {
            element.blazor__instance.options.enableCollision = enableCollision;
            element.blazor__instance.extendedOpen();
            if (element.blazor__instance.popObj) {
                element.blazor__instance.popObj.collision = { Y: enableCollision ? 'flip' : 'none' };
            }
        }
    },
    setAllowKeyboard(element: BlazorToolbarElement, allowKeyboard: boolean): void {
        if (!isNOU(element) && !isNOU(element.blazor__instance)) {
            element.blazor__instance.options.allowKeyboard = allowKeyboard;
            element.blazor__instance.extendedOpen();
            element.blazor__instance.unwireKeyboardEvent();
            if (allowKeyboard) {
                element.blazor__instance.wireKeyboardEvent();
            }
        }
    },
    serverItemsRerender(element: BlazorToolbarElement, items: ItemModel[]): void {
        if (!isNOU(element) && !isNOU(element.blazor__instance)) {
            element.blazor__instance.options.items = items;
            element.blazor__instance.destroyMode();
            element.blazor__instance.resetServerItems();
            element.blazor__instance.serverItemsRefresh();
        }
    },
    hideItem(element: BlazorToolbarElement, items: ItemModel[]): void {
        if (!isNOU(element) && !isNOU(element.blazor__instance)) {
            element.blazor__instance.options.items = items;
            element.blazor__instance.refreshOverflow();
        }
    },
    disable(element: BlazorToolbarElement, value: boolean): void {
        if (!isNOU(element) && !isNOU(element.blazor__instance)) {
            element.blazor__instance.disable(value);
        }
    },
    refreshOverflow(element: BlazorToolbarElement): void {
        if (!isNOU(element) && !isNOU(element.blazor__instance)) {
            element.blazor__instance.refreshOverflow();
        }
    },
    destroy(element: BlazorToolbarElement): void {
        if (!isNOU(element) && !isNOU(element.blazor__instance)) {
            element.blazor__instance.destroy();
        }
    },
    refresh(element: BlazorToolbarElement, options: IToolbarOptions): void {
        if (options.scrollStep === 0) {
            options.scrollStep = null;
        }
        if (!isNOU(element) && !isNOU(element.blazor__instance)) {
            element.blazor__instance.options = options;
            element.blazor__instance.destroyMode();
            element.blazor__instance.resetServerItems();
            element.blazor__instance.serverItemsRefresh();
        }
    }
};
export default Toolbar;