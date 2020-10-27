import { Browser, selectAll, addClass, removeClass, select, closest, EventHandler, KeyboardEvents } from '@syncfusion/ej2-base';
import { KeyboardEventArgs, setStyleAttribute, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import * as events from '../constant';
import * as classes from '../classes';
import { isIDevice, setToolbarStatus } from '../util';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { IToolbarStatus } from '../../src/common/interface';
import { ISetToolbarStatusArgs, NotifyArgs } from '../interfaces';
import { ToolbarType } from '../../src/rich-text-editor/base/enum';

/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
export class Toolbar {
    private tbElement: HTMLElement;
    private parent: SfRichTextEditor;
    private isToolbar: boolean = false;
    private keyBoardModule: KeyboardEvents;
    private isTransformChild: boolean = false;

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.tbElement = this.parent.getToolbarElement() as HTMLElement;
        this.checkIsTransformChild();
        this.addEventListener();
    }
    public getToolbarHeight(): number {
        return this.parent.getToolbar().offsetHeight;
    }
    public getExpandTBarPopHeight(): number {
        let popHeight: number = 0;
        if (this.parent.toolbarSettings.type === ToolbarType.Expand &&
            this.parent.getToolbar().classList.contains(classes.CLS_EXTENDED_TOOLBAR)) {
            let expandPopup: HTMLElement = <HTMLElement>select('.' + classes.CLS_TB_EXTENDED, this.parent.getToolbar());
            if (expandPopup && this.parent.getToolbar().classList.contains(classes.CLS_EXPAND_OPEN)
                || expandPopup && expandPopup.classList.contains(classes.CLS_POPUP_OPEN)) {
                addClass([expandPopup], [classes.CLS_VISIBLE]);
                popHeight = popHeight + expandPopup.offsetHeight;
                removeClass([expandPopup], [classes.CLS_VISIBLE]);
            } else {
                removeClass([this.parent.getToolbar()], [classes.CLS_EXPAND_OPEN]);
            }
        }
        return popHeight;
    }
    private updateToolbarStatus(args: IToolbarStatus): void {
        if (!this.parent.getToolbarElement() || (this.parent.inlineMode.enable && (isIDevice() || !Browser.isDevice))) { return; }
        let options: ISetToolbarStatusArgs = {
            args: args,
            dropDownModule: null,
            parent: this.parent,
            tbElements: selectAll('.' + classes.CLS_TB_ITEM, this.parent.getToolbarElement()),
            /* tslint:disable */
            tbItems: this.parent.toolbarSettings.items as any
            /* tslint:enable */
        };
        setToolbarStatus(options, (this.parent.inlineMode.enable ? true : false));
    }
    private checkIsTransformChild(): void {
        this.isTransformChild = false;
        let transformElements: HTMLElement[] = <HTMLElement[]>selectAll('[style*="transform"]', document);
        for (let i: number = 0; i < transformElements.length; i++) {
            if (!isNOU(transformElements[i].contains) && transformElements[i].contains(this.parent.element)) {
                this.isTransformChild = true;
                break;
            }
        }
    }
    private toggleFloatClass(e?: Event): void {
        let topValue: number;
        let isBody: boolean = false;
        let isFloat: boolean = false;
        let scrollParent: HTMLElement;
        let floatOffset: number = this.parent.floatingToolbarOffset;
        if (e && this.parent.iframeSettings.enable && this.parent.inputElement.ownerDocument === e.target) {
            scrollParent = (e.target as Document).body as HTMLElement;
        } else if (e && e.target !== document) {
            scrollParent = e.target as HTMLElement;
        } else {
            isBody = true;
            scrollParent = document.body;
        }
        let tbHeight: number = this.getToolbarHeight() + this.getExpandTBarPopHeight();
        if (this.isTransformChild) {
            topValue = 0;
            let scrollParentRelativeTop: number = 0;
            let trgHeight: number = this.parent.element.offsetHeight;
            if (isBody) {
                let bodyStyle: CSSStyleDeclaration = window.getComputedStyle(scrollParent);
                scrollParentRelativeTop = parseFloat(bodyStyle.marginTop.split('px')[0]) + parseFloat(bodyStyle.paddingTop.split('px')[0]);
            }
            let targetTop: number = this.parent.element.getBoundingClientRect().top;
            let scrollParentYOffset: number = (Browser.isMSPointer && isBody) ? window.pageYOffset : scrollParent.parentElement.scrollTop;
            let scrollParentRect: ClientRect = scrollParent.getBoundingClientRect();
            let scrollParentTop: number = (!isBody) ? scrollParentRect.top : (scrollParentRect.top + scrollParentYOffset);
            let outOfRange: boolean = ((targetTop - ((!isBody) ? scrollParentTop : 0)) + trgHeight > tbHeight + floatOffset) ? false : true;
            if (targetTop > (scrollParentTop + floatOffset) || targetTop < -trgHeight || ((targetTop < 0) ? outOfRange : false)) {
                isFloat = false;
                removeClass([this.tbElement], [classes.CLS_TB_ABS_FLOAT]);
            } else if (targetTop < (scrollParentTop + floatOffset)) {
                if (targetTop < 0) {
                    topValue = (-targetTop) + scrollParentTop;
                } else {
                    topValue = scrollParentTop - targetTop;
                }
                topValue = (isBody) ? topValue - scrollParentRelativeTop : topValue;
                addClass([this.tbElement], [classes.CLS_TB_ABS_FLOAT]);
                isFloat = true;
            }
        } else {
            let parent: ClientRect = this.parent.element.getBoundingClientRect();
            if (window.innerHeight < parent.top) { return; }
            topValue = (e && e.target !== document) ? scrollParent.getBoundingClientRect().top : 0;
            if ((parent.bottom < (floatOffset + tbHeight + topValue)) || parent.bottom < 0 || parent.top > floatOffset + topValue) {
                isFloat = false;
            } else if (parent.top < floatOffset) {
                isFloat = true;
            }
        }
        if (!isFloat) {
            removeClass([this.tbElement], [classes.CLS_TB_FLOAT]);
            setStyleAttribute(this.tbElement, { top: 0 + 'px', width: '100%' });
        } else {
            addClass([this.tbElement], [classes.CLS_TB_FLOAT]);
            setStyleAttribute(this.tbElement, { width: this.parent.element.offsetWidth + 'px', top: (floatOffset + topValue) + 'px' });
        }
    }
    private getDOMVisibility(el: HTMLElement): boolean {
        if (!el.offsetParent && el.offsetWidth === 0 && el.offsetHeight === 0) {
            return false;
        }
        return true;
    }
    private showFixedTBar(): void {
        this.tbElement = this.parent.getToolbarElement() as HTMLElement;
        addClass([this.tbElement], [classes.CLS_SHOW]);
        if (Browser.isIos) {
            addClass([this.tbElement], [classes.CLS_TB_IOS_FIX]);
        }
    }
    private hideFixedTBar(): void {
        this.tbElement = this.parent.getToolbarElement() as HTMLElement;
        (!this.isToolbar) ? removeClass([this.tbElement], [classes.CLS_SHOW, classes.CLS_TB_IOS_FIX]) : this.isToolbar = false;
    }
    private dropDownBeforeOpenHandler(): void {
        this.isToolbar = true;
    }
    //#region Bind & Unbind Events
    protected addEventListener(): void {
        this.parent.observer.on(events.scroll, this.scrollHandler, this);
        this.parent.observer.on(events.refreshBegin, this.onRefresh, this);
        this.parent.observer.on(events.bindOnEnd, this.toolbarBindEvent, this);
        this.parent.observer.on(events.mouseDown, this.mouseDownHandler, this);
        this.parent.observer.on(events.focusChange, this.focusChangeHandler, this);
        this.parent.observer.on(events.toolbarUpdated, this.updateToolbarStatus, this);
        this.parent.observer.on(events.beforeDropDownOpen, this.dropDownBeforeOpenHandler, this);
    }
    protected removeEventListener(): void {
        this.parent.observer.off(events.scroll, this.scrollHandler);
        this.parent.observer.off(events.refreshBegin, this.onRefresh);
        this.parent.observer.off(events.bindOnEnd, this.toolbarBindEvent);
        this.parent.observer.off(events.mouseDown, this.mouseDownHandler);
        this.parent.observer.off(events.focusChange, this.focusChangeHandler);
        this.parent.observer.off(events.toolbarUpdated, this.updateToolbarStatus);
        this.parent.observer.off(events.beforeDropDownOpen, this.dropDownBeforeOpenHandler);
    }
    protected wireEvents(): void {
        if (this.parent.inlineMode.enable && isIDevice()) { return; }
        this.tbElement = this.parent.getToolbarElement() as HTMLElement;
        EventHandler.add(this.tbElement, 'focusin', this.tbFocusHandler, this);
        EventHandler.add(this.tbElement, 'keydown', this.tbKeydownHandler, this);
    }
    protected unWireEvents(): void {
        EventHandler.remove(this.tbElement, 'focusin', this.tbFocusHandler);
        EventHandler.remove(this.tbElement, 'keydown', this.tbKeydownHandler);
    }
    private toolbarBindEvent(): void {
        if (!this.parent.inlineMode.enable) {
            this.keyBoardModule = new KeyboardEvents(this.parent.getToolbarElement() as HTMLElement, {
                keyAction: this.toolBarKeyDown.bind(this), keyConfigs: this.parent.formatter.keyConfig, eventName: 'keydown'
            });
        }
    }
    //#endregion
    //#region Event handler methods
    private onRefresh(): void {
        this.parent.setContentHeight('', true);
    }
    private tbFocusHandler(e: Event): void {
        let activeElm: Element = document.activeElement;
        let isToolbaractive: Element = closest(activeElm as Element, '.' + classes.CLS_TOOLBAR);
        if (activeElm === this.parent.getToolbarElement() || isToolbaractive === this.parent.getToolbarElement()) {
            let toolbarItem: NodeList = this.parent.getToolbarElement().querySelectorAll('.' + classes.CLS_EXPENDED_NAV);
            for (let i: number = 0; i < toolbarItem.length; i++) {
                if (isNOU(this.parent.getToolbarElement().querySelector('.' + classes.CLS_INSERT_TABLE_BTN))) {
                    (toolbarItem[i] as HTMLElement).setAttribute('tabindex', '0');
                } else {
                    (toolbarItem[i] as HTMLElement).setAttribute('tabindex', '1');
                }
            }
        }
    }
    private tbKeydownHandler(e: Event): void {
        if ((e.target as HTMLElement).classList.contains(classes.CLS_DROP_DOWN_BTN) ||
            (e.target as HTMLElement).getAttribute('id') === this.parent.id + events.toolbarCreateTable) {
            (e.target as HTMLElement).setAttribute('tabindex', '0');
        }
    }
    private toolBarKeyDown(e: KeyboardEvent): void {
        switch ((e as KeyboardEventArgs).action) {
            case 'escape':
                (this.parent.getEditPanel() as HTMLElement).focus();
                break;
        }
    }
    private scrollHandler(e: NotifyArgs): void {
        if (!this.parent.inlineMode.enable) {
            this.tbElement = this.parent.getToolbarElement() as HTMLElement;
            if (this.parent.toolbarSettings.enableFloating && this.getDOMVisibility(this.tbElement)) {
                this.toggleFloatClass(e.args as Event);
            }
        }
    }
    private mouseDownHandler(): void {
        if (Browser.isDevice && this.parent.inlineMode.enable && !isIDevice()) {
            this.showFixedTBar();
        }
    }
    private focusChangeHandler(): void {
        if (Browser.isDevice && this.parent.inlineMode.enable && !isIDevice()) {
            this.isToolbar = false;
            this.hideFixedTBar();
        }
    }
    //#endregion
}