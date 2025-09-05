import { Browser, selectAll, addClass, removeClass, select, closest, EventHandler, KeyboardEvents } from '../../../base'; /*externalscript*/
import { KeyboardEventArgs, setStyleAttribute, isNullOrUndefined as isNOU } from '../../../base'; /*externalscript*/
import * as events from '../constant';
import * as classes from '../classes';
import { isIDevice } from '../../editor-scripts/common/util';
import { setToolbarStatus } from '../util';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { IToolbarStatus } from '../../editor-scripts/common/interface';
import { ISetToolbarStatusArgs } from '../interfaces';
import { ToolbarType } from '../../editor-scripts/common/enum';
import { BeforeOpenCloseMenuEventArgs } from '../../../splitbuttons/src'; /*externalscript*/

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
            const expandPopup: HTMLElement = <HTMLElement>select('.' + classes.CLS_TB_EXTENDED, this.parent.getToolbar());
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
        let options: ISetToolbarStatusArgs;
        if (this.parent.toolbarSettings.type === 'Popup') {
            options = {
                args: args,
                dropDownModule: null,
                parent: this.parent,
                tbElements: selectAll('.' + classes.CLS_TB_ITEM + ':not(.' + classes.CLS_RTE_CUSTOM_TB + ')' + ':not(.' + classes.CLS_SEPARATOR + ')', this.parent.getToolbarElement()),
                /* eslint-disable */
                tbItems: (this.parent.toolbarSettings.items as string[]).filter((item: string) => { return item !== null; }) as any
                /* eslint-enable */
            };
        }
        else {
            options = {
                args: args,
                dropDownModule: null,
                parent: this.parent,
                tbElements: selectAll('.' + classes.CLS_TB_ITEM + ':not(.' + classes.CLS_RTE_CUSTOM_TB + ')', this.parent.getToolbarElement()),
                /* eslint-disable */
                tbItems: this.parent.toolbarSettings.items as any
                /* eslint-enable */
            };
        }
        setToolbarStatus(options, (this.parent.inlineMode.enable ? true : false));
    }
    private checkIsTransformChild(): void {
        this.isTransformChild = false;
        const transformElements: HTMLElement[] = <HTMLElement[]>selectAll('[style*="transform"]', document);
        for (let i: number = 0; i < transformElements.length; i++) {
            if (!isNOU(transformElements[i as number].contains) && transformElements[i as number].contains(this.parent.element)) {
                this.isTransformChild = true;
                break;
            }
        }
    }
    private toggleFloatClass(e?: Event): void {
        const floatOffset: number = this.parent.floatingToolbarOffset;
        if (this.parent.toolbarSettings.enableFloating) {
            addClass([this.tbElement.parentElement], [classes.CLS_TB_FLOAT]);
            setStyleAttribute(this.tbElement.parentElement, { top: (floatOffset) + 'px' });
        } else {
            removeClass([this.tbElement.parentElement], [classes.CLS_TB_FLOAT]);
            setStyleAttribute(this.tbElement.parentElement, { top: '' });
        }
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
        if (!this.isToolbar) {
            removeClass([this.tbElement], [classes.CLS_SHOW, classes.CLS_TB_IOS_FIX]);
        } else {
            this.isToolbar = false;
        }
    }
    private dropDownBeforeOpenHandler(args: BeforeOpenCloseMenuEventArgs): void {
        this.isToolbar = true;
        if (!isNOU(closest(args.element, '.e-rte-toolbar')) && isNOU(closest(args.element, '.e-rte-quick-toolbar'))) {
            this.parent.hideTableQuickToolbar();
        }
    }
    //#region Bind & Unbind Events
    protected addEventListener(): void {
        this.parent.observer.on(events.refreshBegin, this.onRefresh, this);
        this.parent.observer.on(events.mouseDown, this.mouseDownHandler, this);
        this.parent.observer.on(events.focusChange, this.focusChangeHandler, this);
        this.parent.observer.on(events.toolbarUpdated, this.updateToolbarStatus, this);
        this.parent.observer.on(events.beforeDropDownOpen, this.dropDownBeforeOpenHandler, this);
        this.parent.observer.on(events.initialEnd, this.wireEvents, this);
    }
    protected removeEventListener(): void {
        this.parent.observer.off(events.refreshBegin, this.onRefresh);
        this.parent.observer.off(events.mouseDown, this.mouseDownHandler);
        this.parent.observer.off(events.focusChange, this.focusChangeHandler);
        this.parent.observer.off(events.toolbarUpdated, this.updateToolbarStatus);
        this.parent.observer.off(events.beforeDropDownOpen, this.dropDownBeforeOpenHandler);
        this.parent.observer.off(events.initialEnd, this.wireEvents);
    }
    protected wireEvents(): void {
        if (!this.parent.inlineMode.enable) {
            this.toggleFloatClass();
        }
        if (this.parent.inlineMode.enable && isIDevice()) { return; }
        this.tbElement = this.parent.getToolbarElement() as HTMLElement;
        if (this.tbElement) {
            EventHandler.add(this.tbElement, 'focusin', this.tbFocusHandler, this);
            if (!this.parent.inlineMode.enable) {
                this.keyBoardModule = new KeyboardEvents(this.tbElement, {
                    eventName: 'keydown',
                    keyAction: this.toolBarKeyDown.bind(this),
                    keyConfigs: this.parent.formatter && this.parent.formatter.keyConfig
                });
            }
        }
    }
    protected unWireEvents(): void {
        if (this.tbElement) {
            EventHandler.remove(this.tbElement, 'focusin', this.tbFocusHandler);
            if (!this.parent.inlineMode.enable) {
                if (this.keyBoardModule) { this.keyBoardModule.destroy(); }
            }
        }
    }
    //#endregion
    //#region Event handler methods
    private onRefresh(): void {
        this.parent.dotNetRef.invokeMethodAsync(events.refreshToolbarOverflow);
    }
    private tbFocusHandler(e: Event): void {
        const activeElm: Element = document.activeElement;
        const isToolbaractive: Element = closest(activeElm as Element, '.' + classes.CLS_TOOLBAR);
        if (activeElm === this.parent.getToolbarElement() || isToolbaractive === this.parent.getToolbarElement()) {
            const toolbarItem: NodeList = this.parent.getToolbarElement().querySelectorAll('.' + classes.CLS_EXPENDED_NAV);
            for (let i: number = 0; i < toolbarItem.length; i++) {
                if (isNOU(this.parent.getToolbarElement().querySelector('.' + classes.CLS_INSERT_TABLE_BTN))) {
                    (toolbarItem[i as number] as HTMLElement).setAttribute('tabindex', '0');
                } else {
                    (toolbarItem[i as number] as HTMLElement).setAttribute('tabindex', '1');
                }
            }
        }
    }
    private toolBarKeyDown(e: KeyboardEvent): void {
        switch ((e as KeyboardEventArgs).action) {
        case 'escape':
            (this.parent.getEditPanel() as HTMLElement).focus();
            break;
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

    public destroy(): void {
        this.removeEventListener();
        this.unWireEvents();
    }
    //#endregion
}
