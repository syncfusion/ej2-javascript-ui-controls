import { Component, Property, ChildProperty, NotifyPropertyChanges, INotifyPropertyChanged, AnimationModel, isBlazor } from '@syncfusion/ej2-base';
import { Event, EventHandler, EmitType, BaseEventArgs, KeyboardEvents, KeyboardEventArgs, Touch, TapEventArgs } from '@syncfusion/ej2-base';
import { Animation, AnimationOptions, TouchEventArgs, MouseEventArgs } from '@syncfusion/ej2-base';
import { Browser, Collection, setValue, getValue, getUniqueID, getInstance, isNullOrUndefined } from '@syncfusion/ej2-base';
import { select, selectAll, closest, detach, append, rippleEffect, isVisible, Complex, addClass, removeClass } from '@syncfusion/ej2-base';
import { ListBase, ListBaseOptions } from '@syncfusion/ej2-lists';
import { getZindexPartial, calculatePosition, OffsetPosition, isCollide, fit, Popup } from '@syncfusion/ej2-popups';
import { extend, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { getScrollableParent } from '@syncfusion/ej2-popups';
import { MenuItemModel, MenuBaseModel, FieldSettingsModel, MenuAnimationSettingsModel } from './menu-base-model';
import { HScroll } from '../common/h-scroll';
import { VScroll } from '../common/v-scroll';
import { addScrolling, destroyScroll } from '../common/menu-scroll';

type objColl = { [key: string]: Object }[];
type obj = { [key: string]: Object };

const ENTER: string = 'enter';

const ESCAPE: string = 'escape';

const FOCUSED: string = 'e-focused';

const HEADER: string = 'e-menu-header';

const SELECTED: string = 'e-selected';

const SEPARATOR: string = 'e-separator';

const UPARROW: string = 'uparrow';

const DOWNARROW: string = 'downarrow';

const LEFTARROW: string = 'leftarrow';

const RIGHTARROW: string = 'rightarrow';

const HOME: string = 'home';

const END: string = 'end';

const CARET: string = 'e-caret';

const ITEM: string = 'e-menu-item';

const DISABLED: string = 'e-disabled';

const HIDE: string = 'e-menu-hide';

const ICONS: string = 'e-icons';

const RTL: string = 'e-rtl';

const POPUP: string = 'e-menu-popup';

const TEMPLATE_PROPERTY: string = 'Template';

/**
 * Sub menu open type
 */
export type MenuOpenType = 'Auto' | 'Click' | 'Hover';

/**
 * Menu animation effects
 */
export type MenuEffect = 'None' | 'SlideDown' | 'ZoomIn' | 'FadeIn';

/**
 * Configures the field options of the Menu.
 */
export class FieldSettings extends ChildProperty<FieldSettings> {

    /**
     * Specifies the itemId field for Menu item.
     *
     * @default 'id'
     */
    @Property('id')
    public itemId: string | string[];

    /**
     * Specifies the parentId field for Menu item.
     *
     * @default 'parentId'
     */
    @Property('parentId')
    public parentId: string | string[];

    /**
     * Specifies the text field for Menu item.
     *
     * @default 'text'
     */
    @Property('text')
    public text: string | string[];

    /**
     * Specifies the css icon field for Menu item.
     *
     * @default 'iconCss'
     */
    @Property('iconCss')
    public iconCss: string | string[];

    /**
     * Specifies the Url field for Menu item.
     *
     * @default 'url'
     */
    @Property('url')
    public url: string | string[];

    /**
     * Specifies the separator field for Menu item.
     *
     * @default 'separator'
     */
    @Property('separator')
    public separator: string | string[];

    /**
     * Specifies the children field for Menu item.
     *
     * @default 'items'
     */
    @Property('items')
    public children: string | string[];
}

/**
 * Specifies menu items.
 */
export class MenuItem extends ChildProperty<MenuItem> {
    /**
     * Defines class/multiple classes separated by a space for the menu Item that is used to include an icon.
     * Menu Item can include font icon and sprite image.
     *
     * @default null
     */
    @Property(null)
    public iconCss: string;

    /**
     * Specifies the id for menu item.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies separator between the menu items. Separator are either horizontal or vertical lines used to group menu items.
     *
     * @default false
     */
    @Property(false)
    public separator: boolean;

    /**
     * Specifies the sub menu items that is the array of MenuItem model.
     *
     * @default []
     */
    @Collection<MenuItemModel>([], MenuItem)
    public items: MenuItemModel[];

    /**
     * Specifies text for menu item.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Specifies url for menu item that creates the anchor link to navigate to the url provided.
     *
     * @default ''
     */
    @Property('')
    public url: string;
}

/**
 * Animation configuration settings.
 */
export class MenuAnimationSettings extends ChildProperty<MenuAnimationSettings> {
    /**
     * Specifies the effect that shown in the sub menu transform.
     * The possible effects are:
     * * None: Specifies the sub menu transform with no animation effect.
     * * SlideDown: Specifies the sub menu transform with slide down effect.
     * * ZoomIn: Specifies the sub menu transform with zoom in effect.
     * * FadeIn: Specifies the sub menu transform with fade in effect.
     *
     * @default 'SlideDown'
     * @aspType Syncfusion.EJ2.Navigations.MenuEffect
     * @blazorType Syncfusion.EJ2.Navigations.MenuEffect
     * @isEnumeration true
     */
    @Property('SlideDown')
    public effect: MenuEffect;
    /**
     * Specifies the time duration to transform object.
     *
     * @default 400
     */
    @Property(400)
    public duration: number;
    /**
     * Specifies the easing effect applied while transform.
     *
     * @default 'ease'
     */
    @Property('ease')
    public easing: string;
}

/**
 * Base class for Menu and ContextMenu components.
 *
 *  @private
 */
@NotifyPropertyChanges
export abstract class MenuBase extends Component<HTMLUListElement> implements INotifyPropertyChanged {
    private clonedElement: HTMLElement;
    private targetElement: HTMLElement;
    // eslint-disable-next-line @typescript-eslint/ban-types
    private delegateClickHandler: Function;
    // eslint-disable-next-line @typescript-eslint/ban-types
    private delegateMoverHandler: Function;
    // eslint-disable-next-line @typescript-eslint/ban-types
    private delegateMouseDownHandler: Function;
    private navIdx: number[] = [];
    private animation: Animation = new Animation({});
    private isTapHold: boolean = false;
    protected isMenu: boolean;
    protected hamburgerMode: boolean;
    protected title: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    private rippleFn: Function;
    private uList: HTMLElement;
    private lItem: Element;
    private popupObj: Popup;
    private popupWrapper: HTMLElement;
    private isNestedOrVertical: boolean;
    private top: number;
    private left: number;
    private keyType: string;
    private showSubMenu: boolean;
    private action: string;
    private cli: Element;
    private cliIdx: number;
    private isClosed: boolean;
    private liTrgt: Element;
    private isMenusClosed: boolean;
    private isCMenu: boolean;
    private pageX: number;
    private pageY: number;
    private tempItem: objColl = [];
    private showSubMenuOn: MenuOpenType = 'Auto';
    private defaultOption: boolean;
    private timer: number;
    /**
     * Triggers while rendering each menu item.
     *
     * @event beforeItemRender
     * @blazorProperty 'OnItemRender'
     */
    @Event()
    public beforeItemRender: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the menu item.
     *
     * @event beforeOpen
     * @blazorProperty 'OnOpen'
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while opening the menu item.
     *
     * @event onOpen
     * @blazorProperty 'Opened'
     */
    @Event()
    public onOpen: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the menu.
     *
     * @event beforeClose
     * @blazorProperty 'OnClose'
     */
    @Event()
    public beforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while closing the menu.
     *
     * @event onClose
     * @blazorProperty 'Closed'
     */
    @Event()
    public onClose: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting menu item.
     *
     * @event select
     * @blazorProperty 'ItemSelected'
     */
    @Event()
    public select: EmitType<MenuEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event created
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Defines class/multiple classes separated by a space in the Menu wrapper.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * If hoverDelay is set by particular number, the menu will open after that period.
     *
     * @default 0
     */
     @Property(0)
     public hoverDelay: number;

    /**
     * Specifies whether to show the sub menu or not on click.
     * When set to true, the sub menu will open only on mouse click.
     *
     * @default false
     */
    @Property(false)
    public showItemOnClick: boolean;

    /**
     * Specifies target element selector in which the ContextMenu should be opened.
     * Specifies target element to open/close Menu while click in Hamburger mode.
     *
     * @default ''
     * @private
     */
    @Property('')
    public target: string;

    /**
     * Specifies the filter selector for elements inside the target in that the context menu will be opened.
     * Not applicable to Menu component.
     *
     * @default ''
     * @private
     */
    @Property('')
    public filter: string;

    /**
     * Specifies the template for Menu item.
     * Not applicable to ContextMenu component.
     *
     * @default null
     * @private
     */
    @Property(null)
    public template: string;

    /**
     * Specifies whether to enable / disable the scrollable option in Menu.
     * Not applicable to ContextMenu component.
     *
     * @default false
     * @private
     */
    @Property(false)
    public enableScrolling: boolean;

    /**
     * Defines whether to allow the cross-scripting site or not.
     *
     * @default false
     */
    @Property(false)
    public enableHtmlSanitizer: boolean;

    /**
     * Specifies mapping fields from the dataSource.
     * Not applicable to ContextMenu component.
     *
     * @default { itemId: "id", text: "text", parentId: "parentId", iconCss: "iconCss", url: "url", separator: "separator",
     * children: "items" }
     * @private
     */
    // eslint:disable-next-line
    @Complex<FieldSettingsModel>({ itemId: 'id', text: 'text', parentId: 'parentId', iconCss: 'iconCss', url: 'url', separator: 'separator', children: 'items' }, FieldSettings)
    public fields: FieldSettingsModel;

    /**
     * Specifies menu items with its properties which will be rendered as Menu.
     *
     * @default []
     */
    @Collection<MenuItemModel>([], MenuItem)
    public items: MenuItemModel[] | { [key: string]: Object }[];

    /**
     * Specifies the animation settings for the sub menu open.
     *
     * @default { duration: 400, easing: 'ease', effect: 'SlideDown' }
     */
    @Complex<MenuAnimationSettingsModel>({ duration: 400, easing: 'ease', effect: 'SlideDown' }, MenuAnimationSettings)
    public animationSettings: MenuAnimationSettingsModel;

    /**
     * Constructor for creating the widget.
     *
     * @private
     * @param {MenuBaseModel} options - Specifies the menu base model
     * @param {string | HTMLUListElement} element - Specifies the element
     */
    constructor(options?: MenuBaseModel, element?: string | HTMLUListElement) {
        super(options, <HTMLUListElement | string>element);
    }

    /**
     * Initialized third party configuration settings.
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        if (!this.isMenu) {
            let ul: HTMLUListElement;
            if (this.element.tagName === 'EJS-CONTEXTMENU') {
                ul = this.createElement('ul', {
                    id: getUniqueID(this.getModuleName()), className: 'e-control e-lib e-' + this.getModuleName() }) as HTMLUListElement;
                const ejInst: Object = getValue('ej2_instances', this.element);
                removeClass([this.element], ['e-control', 'e-lib', 'e-' + this.getModuleName()]);
                this.clonedElement = this.element; this.element = ul;
                setValue('ej2_instances', ejInst, this.element);
            } else {
                ul = this.createElement('ul', { id: getUniqueID(this.getModuleName()) }) as HTMLUListElement;
                append([].slice.call((this.element.cloneNode(true) as Element).children), ul);
                const refEle: Element = this.element.nextElementSibling;
                if (refEle) {
                    this.element.parentElement.insertBefore(ul, refEle);
                } else {
                    this.element.parentElement.appendChild(ul);
                }
                this.clonedElement = ul;
            }
            this.clonedElement.style.display = 'none';
        }
        if (this.element.tagName === 'EJS-MENU') {
            let ele: Element = this.element;
            const ejInstance: Object = getValue('ej2_instances', ele);
            const ul: Element = this.createElement('ul');
            const wrapper: HTMLElement = this.createElement('EJS-MENU', { className: 'e-' + this.getModuleName() + '-wrapper' });
            for (let idx: number = 0, len: number = ele.attributes.length; idx < len; idx++) {
                ul.setAttribute(ele.attributes[idx].nodeName, ele.attributes[idx].nodeValue);
            }
            ele.parentNode.insertBefore(wrapper, ele);
            detach(ele);
            ele = ul;
            wrapper.appendChild(ele);
            setValue('ej2_instances', ejInstance, ele);
            this.clonedElement = wrapper;
            this.element = ele as HTMLUListElement;
            if (!this.element.id) {
                this.element.id = getUniqueID(this.getModuleName());
            }
        }
    }

    /**
     * Initialize the control rendering.
     *
     * @private
     * @returns {void}
     */
    protected render(): void {
        this.initialize();
        this.renderItems();
        this.wireEvents();
        this.renderComplete();
        const wrapper: HTMLElement = this.getWrapper() as HTMLElement;
        if (this.template && this.enableScrolling && ((this as any).isReact || (this as any).isAngular)) {
            requestAnimationFrame(() => {
                addScrolling(this.createElement, wrapper, this.element, 'hscroll', this.enableRtl);
            })
        }
    }

    protected initialize(): void {
        let wrapper: Element = this.getWrapper();
        if (!wrapper) {
            wrapper = this.createElement('div', { className: 'e-' + this.getModuleName() + '-wrapper' });
            if (this.isMenu) {
                this.element.parentElement.insertBefore(wrapper, this.element);
            } else {
                document.body.appendChild(wrapper);
            }
        }
        if (this.cssClass) {
            addClass([wrapper], this.cssClass.split(' '));
        }
        if (this.enableRtl) {
            wrapper.classList.add(RTL);
        }
        wrapper.appendChild(this.element);
        if (this.isMenu && this.hamburgerMode) {
            if (!this.target) {
                this.createHeaderContainer(wrapper);
            }
        }
        this.defaultOption = this.showItemOnClick;
    }

    private renderItems(): void {
        if (!(this.items as objColl).length) {
            const items: { [key: string]: Object; }[] = ListBase.createJsonFromElement(this.element, { fields: { child: 'items' } });
            this.setProperties({ items: items }, true);
            if (isBlazor() && !this.isMenu) {
                this.element = this.removeChildElement(this.element);
            } else {
                this.element.innerHTML = '';
            }
        }
        const ul: Element = this.createItems(this.items as objColl);
        append(Array.prototype.slice.call(ul.children), this.element);
        this.element.classList.add('e-menu-parent');
        if (this.isMenu) {
            if (!this.hamburgerMode && this.element.classList.contains('e-vertical')) { this.setBlankIconStyle(this.element); }
            if (this.enableScrolling) {
                const wrapper: HTMLElement = this.getWrapper() as HTMLElement;
                if (this.element.classList.contains('e-vertical')){
                    addScrolling(this.createElement, wrapper, this.element, 'vscroll', this.enableRtl);
                } else {
                    addScrolling(this.createElement, wrapper, this.element, 'hscroll', this.enableRtl);
                }
            }
        }
    }

    protected wireEvents(): void {
        const wrapper: HTMLElement = this.getWrapper() as HTMLElement;
        if (this.target) {
            let target: HTMLElement;
            const targetElems: HTMLElement[] = selectAll(this.target);
            for (let i: number = 0, len: number = targetElems.length; i < len; i++) {
                target = targetElems[i];
                if (this.isMenu) {
                    EventHandler.add(target, 'click', this.menuHeaderClickHandler, this);
                } else {
                    if (Browser.isIos) {
                        new Touch(target, { tapHold: this.touchHandler.bind(this) });
                    } else {
                        EventHandler.add(target, 'contextmenu', this.cmenuHandler, this);
                    }
                }
            }
            this.targetElement = target;
            if (!this.isMenu) {
                EventHandler.add(this.targetElement, 'scroll', this.scrollHandler, this);
                for (const parent of getScrollableParent(this.targetElement)) {
                    EventHandler.add(parent, 'scroll', this.scrollHandler, this);
                }
            }
        }
        if (!Browser.isDevice) {
            this.delegateMoverHandler = this.moverHandler.bind(this);
            this.delegateMouseDownHandler = this.mouseDownHandler.bind(this);
            EventHandler.add(this.isMenu ? document : wrapper, 'mouseover', this.delegateMoverHandler, this);
            EventHandler.add(document, 'mousedown', this.delegateMouseDownHandler, this);
        }
        this.delegateClickHandler = this.clickHandler.bind(this);
        EventHandler.add(document, 'click', this.delegateClickHandler, this);
        this.wireKeyboardEvent(wrapper);
        this.rippleFn = rippleEffect(wrapper, { selector: '.' + ITEM });
    }

    private wireKeyboardEvent(element: HTMLElement): void {
        const keyConfigs: { [key: string]: string; } = {
            downarrow: DOWNARROW,
            uparrow: UPARROW,
            enter: ENTER,
            leftarrow: LEFTARROW,
            rightarrow: RIGHTARROW,
            escape: ESCAPE
        };
        if (this.isMenu) {
            keyConfigs.home = HOME;
            keyConfigs.end = END;
        }
        new KeyboardEvents(element, {
            keyAction: this.keyBoardHandler.bind(this),
            keyConfigs: keyConfigs
        });
    }

    private mouseDownHandler(e: MouseEvent): void {
        if (closest(e.target as Element, '.e-' + this.getModuleName() + '-wrapper') !== this.getWrapper()
            && (!closest(e.target as Element, '.e-' + this.getModuleName() + '-popup'))) {
            this.closeMenu(this.isMenu ? null : this.navIdx.length, e);
        }
    }

    private keyBoardHandler(e: KeyboardEventArgs): void {
        let actionName: string = '';
        const trgt: Element = e.target as Element;
        let actionNeeded: boolean = this.isMenu && !this.hamburgerMode && !this.element.classList.contains('e-vertical')
            && this.navIdx.length < 1;
        e.preventDefault();
        if (this.enableScrolling && e.keyCode ===  13 && trgt.classList.contains('e-scroll-nav')) {
            this.removeLIStateByClass([FOCUSED, SELECTED], [closest(trgt, '.e-' + this.getModuleName() + '-wrapper')]);
        }
        if (actionNeeded) {
            switch (e.action) {
            case RIGHTARROW:
                actionName = RIGHTARROW;
                e.action = DOWNARROW;
                break;
            case LEFTARROW:
                actionName = LEFTARROW;
                e.action = UPARROW;
                break;
            case DOWNARROW:
                actionName = DOWNARROW;
                e.action = RIGHTARROW;
                break;
            case UPARROW:
                actionName = UPARROW;
                e.action = '';
                break;
            }
        } else if (this.enableRtl) {
            switch (e.action) {
            case LEFTARROW:
                actionNeeded = true;
                actionName = LEFTARROW;
                e.action = RIGHTARROW;
                break;
            case RIGHTARROW:
                actionNeeded = true;
                actionName = RIGHTARROW;
                e.action = LEFTARROW;
                break;
            }
        }
        switch (e.action) {
        case DOWNARROW:
        case UPARROW:
        case END:
        case HOME:
            this.upDownKeyHandler(e);
            break;
        case RIGHTARROW:
            this.rightEnterKeyHandler(e);
            break;
        case LEFTARROW:
            this.leftEscKeyHandler(e);
            break;
        case ENTER:
            if (this.hamburgerMode && trgt.tagName === 'SPAN' && trgt.classList.contains('e-menu-icon')) {
                this.menuHeaderClickHandler(e);
            } else {
                this.rightEnterKeyHandler(e);
            }
            break;
        case ESCAPE:
            this.leftEscKeyHandler(e);
            break;
        }
        if (actionNeeded) {
            e.action = actionName;
        }
    }

    private upDownKeyHandler(e: KeyboardEventArgs): void {
        const cul: Element = this.getUlByNavIdx();
        const defaultIdx: number = (e.action === DOWNARROW || e.action === HOME) ? 0 : cul.childElementCount - 1;
        let fliIdx: number = defaultIdx;
        const fli: Element = this.getLIByClass(cul, FOCUSED);
        if (fli) {
            if (e.action !== END && e.action !== HOME) {
                fliIdx = this.getIdx(cul, fli);
            }
            fli.classList.remove(FOCUSED);
            if (e.action !== END && e.action !== HOME) {
                if (e.action === DOWNARROW){
                    fliIdx++;
                } else {
                    fliIdx--;
                }
                if (fliIdx === (e.action === DOWNARROW ? cul.childElementCount : -1)) {
                    fliIdx = defaultIdx;
                }
            }
        }
        const cli: Element = cul.children[fliIdx];
        fliIdx = this.isValidLI(cli, fliIdx, e.action);
        cul.children[fliIdx].classList.add(FOCUSED);
        (cul.children[fliIdx] as HTMLElement).focus();
    }

    private isValidLI(cli: Element, index: number, action: string): number {
        const cul: Element = this.getUlByNavIdx();
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            if ((action === DOWNARROW) || (action === RIGHTARROW)) {
                index++;
            } else {
                index--;
            }
        }
        cli = cul.children[index];
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            index = this.isValidLI(cli, index, action);
        }
        return index;
    }

    private getUlByNavIdx(navIdxLen: number = this.navIdx.length): HTMLElement {
        if (this.isMenu) {
            const popup: Element = [this.getWrapper()].concat([].slice.call(selectAll('.' + POPUP)))[navIdxLen];
            return isNullOrUndefined(popup) ? null : select('.e-menu-parent', popup) as HTMLElement;
        } else {
            return this.getWrapper().children[navIdxLen] as HTMLElement;
        }
    }

    private rightEnterKeyHandler(e: KeyboardEventArgs): void {
        let eventArgs: MenuEventArgs;
        const cul: Element = this.getUlByNavIdx();
        const fli: Element = this.getLIByClass(cul, FOCUSED);
        if (fli) {
            const fliIdx: number = this.getIdx(cul, fli);
            const navIdx: number[] = this.navIdx.concat(fliIdx);
            const item: MenuItemModel = this.getItem(navIdx);
            if (item.items.length) {
                this.navIdx.push(fliIdx);
                this.keyType = 'right';
                this.action = e.action;
                this.openMenu(fli, item, -1, -1, e);
            } else {
                if (e.action === ENTER) {
                    if (this.isMenu && this.navIdx.length === 0) {
                        this.removeLIStateByClass([SELECTED], [this.getWrapper()]);
                    } else {
                        fli.classList.remove(FOCUSED);
                    }
                    fli.classList.add(SELECTED);
                    eventArgs = { element: fli as HTMLElement, item: item, event: e };
                    this.trigger('select', eventArgs);
                    this.closeMenu(null, e);
                }
            }
        }
    }

    private leftEscKeyHandler(e: KeyboardEventArgs): void {
        if (this.navIdx.length) {
            this.keyType = 'left';
            this.closeMenu(this.navIdx.length, e);
        } else {
            if (e.action === ESCAPE) {
                this.closeMenu(null, e);
            }
        }
    }

    private scrollHandler(e: MouseEvent): void {
        this.closeMenu(null, e);
    }

    private touchHandler(e: TapEventArgs): void {
        this.isTapHold = true;
        this.cmenuHandler(e.originalEvent);
    }

    private cmenuHandler(e: MouseEvent & (TouchEventArgs | MouseEventArgs)): void {
        e.preventDefault();
        this.isCMenu = true;
        this.pageX = e.changedTouches ? e.changedTouches[0].pageX + 1 : e.pageX + 1;
        this.pageY = e.changedTouches ? e.changedTouches[0].pageY + 1 : e.pageY + 1;
        this.closeMenu(null, e);
        if (this.isCMenu) {
            if (this.canOpen(e.target as Element)) {
                this.openMenu(null, null, this.pageY, this.pageX, e);
            }
            this.isCMenu = false;
        }
    }

    // eslint:disable-next-line:max-func-body-length
    protected closeMenu(ulIndex: number = 0, e: MouseEvent | KeyboardEvent = null, isIterated?: boolean): void {
        if (this.isMenuVisible()) {
            let sli: Element; let item: MenuItemModel; const wrapper: Element = this.getWrapper();
            let beforeCloseArgs: BeforeOpenCloseMenuEventArgs; let items: MenuItemModel[]; const popups: Element[] = this.getPopups();
            let isClose: boolean = false; const cnt: number = this.isMenu ? popups.length + 1 : wrapper.childElementCount;
            const ul: HTMLElement = this.isMenu && cnt !== 1 ? select('.e-ul', popups[cnt - 2]) as HTMLElement
                : selectAll('.e-menu-parent', wrapper)[cnt - 1] as HTMLElement;
            if (this.isMenu && ul.classList.contains('e-menu')) {
                sli = this.getLIByClass(ul, SELECTED);
                if (sli) {
                    sli.classList.remove(SELECTED);
                }
                isClose = true;
            }
            if (!isClose) {
                const liElem: Element = e && e.target && this.getLI(e.target as Element);
                item = this.navIdx.length ? this.getItem(this.navIdx) : null; items = item ? item.items : this.items as objColl;
                beforeCloseArgs = { element: ul, parentItem: item, items: items, event: e, cancel: false , isFocused: true };
                this.trigger('beforeClose', beforeCloseArgs, (observedCloseArgs: BeforeOpenCloseMenuEventArgs) => {
                    let popupEle: HTMLElement; let closeArgs: OpenCloseMenuEventArgs; let popupId: string = '';
                    let popupObj: Popup; const isOpen: boolean = !observedCloseArgs.cancel;
                    if (isOpen || this.isCMenu) {
                        if (this.isMenu) {
                            popupEle = closest(ul, '.' + POPUP) as HTMLElement;
                            if (this.hamburgerMode) {
                                popupEle.parentElement.style.minHeight = '';
                                closest(ul, '.e-menu-item').setAttribute('aria-expanded', 'false');
                            }
                            this.unWireKeyboardEvent(popupEle);
                            destroyScroll(
                                getInstance(popupEle.children[0] as HTMLElement, VScroll) as VScroll, popupEle.children[0]);
                            popupObj = getInstance(popupEle, Popup) as Popup;
                            popupObj.hide(); popupId = popupEle.id; popupObj.destroy(); detach(popupEle);
                        } else {
                            this.toggleAnimation(ul, false);
                        }
                        closeArgs = { element: ul, parentItem: item, items: items };
                        this.trigger('onClose', closeArgs); this.navIdx.pop();
                    }
                    this.updateReactTemplate(); let trgtliId: string; let closedLi: Element; let trgtLi: Element;
                    const trgtpopUp: HTMLElement = this.getWrapper() && this.getUlByNavIdx();
                    if (this.isCMenu) {
                        if (this.canOpen(e.target as Element)) {
                            this.openMenu(null, null, this.pageY, this.pageX, e);
                        }
                        this.isCMenu = false;
                    }
                    if (this.isMenu && trgtpopUp && popupId.length) {
                        trgtliId = new RegExp('(.*)-ej2menu-' + this.element.id + '-popup').exec(popupId)[1];
                        closedLi = trgtpopUp.querySelector('[id="' + trgtliId + '"]');
                        trgtLi = (liElem && trgtpopUp.querySelector('[id="' + liElem.id + '"]'));
                    }
                    const submenus: NodeListOf<Element> = liElem && liElem.querySelectorAll('.e-menu-item');
                    if (isOpen && this.hamburgerMode && ulIndex && !(submenus.length)) {
                        this.afterCloseMenu(e as MouseEvent);
                    } else if (isOpen && !this.hamburgerMode && this.navIdx.length && closedLi && !trgtLi) {
                        let ele: HTMLElement = (e && (e.target as Element).classList.contains('e-vscroll'))
                            ? closest(e.target as Element, '.e-menu-wrapper') as HTMLElement : null;
                        if (ele) {
                            ele = ele.querySelector('.e-menu-item');
                            if (this.showItemOnClick || (ele && this.getIndex(ele.id, true).length <= this.navIdx.length)) {
                                this.closeMenu(this.navIdx[this.navIdx.length - 1], e, true);
                            }
                        } else {
                            this.closeMenu(this.navIdx[this.navIdx.length - 1], e);
                        }
                    } else if (isOpen && !isIterated && !ulIndex && ((this.hamburgerMode && this.navIdx.length) ||
                        this.navIdx.length === 1)) {
                        this.closeMenu(null, e);
                    } else if (isOpen && isNullOrUndefined(ulIndex) && this.navIdx.length) {
                        this.closeMenu(null, e);
                    } else if (isOpen && !this.isMenu && !ulIndex && this.navIdx.length === 0 && !this.isMenusClosed) {
                        this.isMenusClosed = true;
                        this.closeMenu(0, e);
                    } else if (isOpen && this.isMenu && e && e.target &&
                        this.navIdx.length !== 0 && closest(e.target as Element, '.e-menu-parent.e-control')) {
                        this.closeMenu(0, e);
                    } else {
                        if (isOpen && (this.keyType === 'right' || this.keyType === 'click')) {
                            this.afterCloseMenu(e as MouseEvent);
                        } else {
                            const cul: Element = this.getUlByNavIdx(); const sli: Element = this.getLIByClass(cul, SELECTED);
                            if (sli) {
                                sli.setAttribute('aria-expanded', 'false'); sli.classList.remove(SELECTED);
                                if (observedCloseArgs.isFocused  && liElem) {
                                    sli.classList.add(FOCUSED); (sli as HTMLElement).focus();
                                }
                            }
                            if (!isOpen && this.hamburgerMode && liElem && liElem.getAttribute('aria-expanded') === 'false' &&
                            liElem.getAttribute('aria-haspopup') === 'true') {
                                if (closest(liElem as Element, '.e-menu-parent.e-control')) {
                                    this.navIdx = [];
                                } else {
                                    this.navIdx.pop();
                                }
                                this.navIdx.push(this.cliIdx); const item: MenuItemModel = this.getItem(this.navIdx);
                                liElem.setAttribute('aria-expanded', 'true'); this.openMenu(liElem, item, -1, -1, e);
                            }
                        }
                        if (this.navIdx.length < 1) {
                            if (this.showSubMenuOn === 'Hover' || this.showSubMenuOn === 'Click') {
                                this.showItemOnClick = this.defaultOption; this.showSubMenuOn = 'Auto';
                            }
                        }
                    }
                    this.removeStateWrapper();
                });
            }
        }
    }
    private updateReactTemplate(): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).isReact && this.template && this.navIdx.length === 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const portals: any = (this as any).portals.splice(0, this.items.length);
            this.clearTemplate(['template']);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any).portals = portals; this.renderReactTemplates();
        }
    }
    private getMenuItemModel(item: obj, level: number): MenuItemModel {
        if (isNullOrUndefined(item)) { return null; }
        if (isNullOrUndefined(level)) { level = 0; }
        const fields: FieldsMap = this.getFields(level);
        return <MenuItemModel>{ text: item[fields.text], id: item[fields.id], items: item[fields.child], separator: item[fields.separator],
            iconCss: item[fields.iconCss], url: item[fields.url] };
    }

    private getPopups(): Element[] {
        const popups: Element[] = [];
        [].slice.call(document.querySelectorAll('.' + POPUP)).forEach((elem: Element) => {
            if (!isNullOrUndefined(elem.querySelector('.' + ITEM)) && this.getIndex(elem.querySelector('.' + ITEM).id, true).length) {
                popups.push(elem);
            }
        });
        return popups;
    }

    private isMenuVisible(): boolean {
        return (this.navIdx.length > 0 || (this.element.classList.contains('e-contextmenu') && isVisible(this.element).valueOf()));
    }

    private canOpen(target: Element): boolean {
        let canOpen: boolean = true;
        if (this.filter) {
            canOpen = false;
            const filter: string[] = this.filter.split(' ');
            for (let i: number = 0, len: number = filter.length; i < len; i++) {
                if (closest(target, '.' + filter[i])) {
                    canOpen = true;
                    break;
                }
            }
        }
        return canOpen;
    }

    protected openMenu(
        li: Element, item: MenuItemModel | { [key: string]: Object }, top: number = 0, left: number = 0,
        e: MouseEvent | KeyboardEvent = null, target: HTMLElement = this.targetElement): void {
        const wrapper: Element = this.getWrapper();
        this.lItem = li; const elemId: string = this.element.id !== '' ? this.element.id : 'menu';
        this.isMenusClosed = false;
        if (isNullOrUndefined(top)) {
            top = -1;
        }
        if (isNullOrUndefined(left)) {
            left = -1;
        }
        if (li) {
            this.uList = this.createItems((<obj>item)[this.getField('children', this.navIdx.length - 1)] as objColl);
            if (!this.isMenu && Browser.isDevice) {
                (wrapper.lastChild as HTMLElement).style.display = 'none';
                const data: { [key: string]: string } = {
                    text: (<obj>item)[this.getField('text')].toString(), iconCss: ICONS + ' e-previous'
                };
                const hdata: MenuItem = new MenuItem(this.items[0] as MenuItem, 'items', data, true);
                const hli: Element = this.createItems([hdata] as MenuItemModel[]).children[0];
                hli.classList.add(HEADER); this.uList.insertBefore(hli, this.uList.children[0]);
            }
            if (this.isMenu) {
                this.popupWrapper = this.createElement('div', {
                    className: 'e-' + this.getModuleName() + '-wrapper ' + POPUP, id: li.id + '-ej2menu-' + elemId + '-popup' });
                if (this.hamburgerMode) {
                    top = (li as HTMLElement).offsetHeight; li.appendChild(this.popupWrapper);
                } else {
                    document.body.appendChild(this.popupWrapper);
                }
                this.isNestedOrVertical = this.element.classList.contains('e-vertical') || this.navIdx.length !== 1;
                this.popupObj = this.generatePopup(this.popupWrapper, this.uList, li as HTMLElement, this.isNestedOrVertical);
                if (this.template) { this.renderReactTemplates(); }
                if (this.hamburgerMode) {
                    this.calculateIndentSize(this.uList, li);
                } else {
                    if (this.cssClass) { addClass([this.popupWrapper], this.cssClass.split(' ')); }
                    this.popupObj.hide();
                }
                if (!this.hamburgerMode && !this.showItemOnClick && this.hoverDelay) {
                    window.clearInterval(this.timer);
                    this.timer = window.setTimeout(
                        () => { this.triggerBeforeOpen(li, this.uList, item, e, 0, 0, 'menu'); }, this.hoverDelay );
                } else {
                    this.triggerBeforeOpen(li, this.uList, item, e, 0, 0, 'menu');
                }
            } else {
                this.uList.style.zIndex = this.element.style.zIndex; wrapper.appendChild(this.uList);
                if (!this.showItemOnClick && this.hoverDelay) {
                    window.clearInterval(this.timer);
                    this.timer = window.setTimeout(
                        () => { this.triggerBeforeOpen(li, this.uList, item, e, top, left, 'none'); }, this.hoverDelay );
                } else {
                    this.triggerBeforeOpen(li, this.uList, item, e, top, left, 'none');
                }
            }
        } else {
            this.uList = this.element;
            this.uList.style.zIndex = getZindexPartial(target ? target : this.element).toString();
            this.triggerBeforeOpen(li, this.uList, item, e, top, left, 'none');
        }
    }

    private calculateIndentSize(ul: HTMLElement, li: Element): void {
        const liStyle: CSSStyleDeclaration = getComputedStyle(li);
        let liIndent: number = parseInt(liStyle.textIndent, 10);
        if (this.navIdx.length < 2 && !li.classList.contains('e-blankicon')) {
            liIndent *= 2;
        } else {
            liIndent += (liIndent / 4);
        }
        ul.style.textIndent = liIndent + 'px';
        const blankIconElem: NodeList = ul.querySelectorAll('.e-blankicon');
        if (blankIconElem && blankIconElem.length) {
            const menuIconElem: HTMLElement = ul.querySelector('.e-menu-icon');
            const menuIconElemStyle: CSSStyleDeclaration = getComputedStyle(menuIconElem);
            const blankIconIndent: number = (parseInt(menuIconElemStyle.marginRight, 10) + menuIconElem.offsetWidth + liIndent);
            for (let i: number = 0; i < blankIconElem.length; i++) {
                (blankIconElem[i] as HTMLElement).style.textIndent = blankIconIndent + 'px';
            }
        }
    }

    private generatePopup(
        popupWrapper: HTMLElement, ul: HTMLElement, li: HTMLElement, isNestedOrVertical: boolean): Popup {
        const popupObj: Popup = new Popup(popupWrapper, {
            actionOnScroll: this.hamburgerMode ? 'none' : 'reposition',
            relateTo: li,
            collision: this.hamburgerMode ? { X: 'none', Y: 'none' } : { X: isNestedOrVertical ||
                this.enableRtl ? 'none' : 'flip', Y: 'fit' },
            position: (isNestedOrVertical && !this.hamburgerMode) ? { X: 'right', Y: 'top' } : { X: 'left', Y: 'bottom' },
            targetType: 'relative',
            enableRtl: this.enableRtl,
            content: ul,
            open: (): void => {
                const scrollEle: HTMLElement = select('.e-menu-vscroll', popupObj.element) as HTMLElement;
                if (scrollEle) {
                    scrollEle.style.height = 'inherit';
                    scrollEle.style.maxHeight = '';
                }
                const ul: HTMLElement = select('.e-ul', popupObj.element) as HTMLElement;
                popupObj.element.style.maxHeight = '';
                ul.focus();
                this.triggerOpen(ul);
            }
        });
        return popupObj;
    }

    protected createHeaderContainer(wrapper?: Element): void {
        wrapper = wrapper || this.getWrapper();
        const spanElem: HTMLElement = this.createElement('span', { className: 'e-' + this.getModuleName() + '-header' });
        const tempTitle: string = (this.enableHtmlSanitizer) ? SanitizeHtmlHelper.sanitize(this.title) : this.title;
        const spanTitle: HTMLElement = this.createElement('span', {
            className: 'e-' + this.getModuleName() + '-title', innerHTML: tempTitle });
        const spanIcon: HTMLElement = this.createElement('span', {
            className: 'e-icons e-' + this.getModuleName() + '-icon', attrs: { 'tabindex': '0' } });
        spanElem.appendChild(spanTitle);
        spanElem.appendChild(spanIcon);
        wrapper.insertBefore(spanElem, this.element);
    }

    protected openHamburgerMenu(e?: MouseEvent | KeyboardEvent) : void {
        if (this.hamburgerMode) {
            this.triggerBeforeOpen(null, this.element, null, e, 0, 0, 'hamburger');
        }
    }

    protected closeHamburgerMenu(e?: MouseEvent | KeyboardEvent) : void {
        const beforeCloseArgs: BeforeOpenCloseMenuEventArgs = { element: this.element, parentItem: null, event: e,
            items: this.items, cancel: false };
        this.trigger('beforeClose', beforeCloseArgs, (observedHamburgerCloseArgs: BeforeOpenCloseMenuEventArgs) => {
            if (!observedHamburgerCloseArgs.cancel) {
                this.closeMenu(null, e);
                this.element.classList.add('e-hide-menu');
                this.trigger('onClose', { element: this.element, parentItem: null, items: this.items });
            }
        });
    }

    private callFit(element: HTMLElement, x: boolean, y: boolean, top: number, left: number): OffsetPosition {
        return fit(element, null, { X: x, Y: y }, { top: top, left: left });
    }

    private triggerBeforeOpen(
        li: Element, ul: HTMLElement, item: MenuItemModel, e: MouseEvent | KeyboardEvent,
        top: number, left: number, type: string): void {
        const items: MenuItemModel[] = li ? (<obj>item)[this.getField('children', this.navIdx.length - 1)] as objColl : this.items as objColl;
        const eventArgs: BeforeOpenCloseMenuEventArgs = {
            element: ul, items: items, parentItem: item, event: e, cancel: false, top: top, left: left, showSubMenuOn: 'Auto'};
        const menuType: string = type;
        this.trigger('beforeOpen', eventArgs, (observedOpenArgs: BeforeOpenCloseMenuEventArgs) => {
            switch (menuType) {
            case 'menu':
                if (!this.hamburgerMode) {
                    if (observedOpenArgs.showSubMenuOn !== 'Auto') {
                        this.showItemOnClick = !this.defaultOption; this.showSubMenuOn = observedOpenArgs.showSubMenuOn;
                    }
                    this.top = observedOpenArgs.top; this.left = observedOpenArgs.left;
                }
                this.popupWrapper.style.display = 'block';
                if (!this.hamburgerMode) {
                    this.popupWrapper.style.maxHeight = this.popupWrapper.getBoundingClientRect().height + 'px';
                    if (this.enableScrolling) {
                        addScrolling(this.createElement, this.popupWrapper, this.uList, 'vscroll', this.enableRtl);
                    }
                    this.checkScrollOffset(e);
                }
                if (!this.hamburgerMode && !this.left && !this.top) {
                    this.popupObj.refreshPosition(this.lItem as HTMLElement, true);
                    this.left = parseInt(this.popupWrapper.style.left, 10); this.top = parseInt(this.popupWrapper.style.top, 10);
                    if (this.enableRtl) {
                        this.left =
                        this.isNestedOrVertical ? this.left - this.popupWrapper.offsetWidth - this.lItem.parentElement.offsetWidth + 2
                            : this.left - this.popupWrapper.offsetWidth + (this.lItem as HTMLElement).offsetWidth;
                    }
                    if (this.template && ((this as any).isReact || (this as any).isAngular)) {
                        requestAnimationFrame(() => {
                            this.collision();
                            this.popupWrapper.style.display = '';
                        })
                    } else {
                        this.collision();
                        this.popupWrapper.style.display = '';
                    }  
                } else {
                    this.popupObj.collision = { X: 'none', Y: 'none' };
                    this.popupWrapper.style.display = '';
                }
                break;
            case 'none':
                this.top = observedOpenArgs.top; this.left = observedOpenArgs.left;
                break;
            case 'hamburger':
                if (!observedOpenArgs.cancel) {
                    this.element.classList.remove('e-hide-menu'); this.triggerOpen(this.element);
                }
                break;
            }
            if (menuType !== 'hamburger') {
                if (observedOpenArgs.cancel) {
                    if (this.isMenu) {
                        this.popupObj.destroy(); detach(this.popupWrapper);
                    } else if (ul.className.indexOf('e-ul') > -1) { detach(ul); }
                    this.navIdx.pop();
                } else {
                    if (this.isMenu) {
                        if (this.hamburgerMode) {
                            this.popupWrapper.style.top = this.top + 'px'; this.popupWrapper.style.left = 0 + 'px';
                            this.toggleAnimation(this.popupWrapper);
                        } else {
                            this.setBlankIconStyle(this.popupWrapper);
                            this.wireKeyboardEvent(this.popupWrapper); rippleEffect(this.popupWrapper, { selector: '.' + ITEM });
                            this.popupWrapper.style.left = this.left + 'px';
                            this.popupWrapper.style.top = this.top + 'px';
                            const animationOptions: AnimationModel = this.animationSettings.effect !== 'None' ? {
                                name: this.animationSettings.effect, duration: this.animationSettings.duration,
                                timingFunction: this.animationSettings.easing
                            } : null;
                            this.popupObj.show(animationOptions, this.lItem as HTMLElement);
                        }
                    } else {
                        this.setBlankIconStyle(this.uList);
                        this.setPosition(this.lItem, this.uList, this.top, this.left); this.toggleAnimation(this.uList);
                    }
                }
            }
            if (this.keyType === 'right') {
                let cul: Element = this.getUlByNavIdx(); li.classList.remove(FOCUSED);
                if (this.isMenu && this.navIdx.length === 1) {
                    this.removeLIStateByClass([SELECTED], [this.getWrapper()]);
                }
                li.classList.add(SELECTED);
                if (this.action === ENTER) {
                    const eventArgs: MenuEventArgs = { element: li as HTMLElement, item: item, event: e };
                    this.trigger('select', eventArgs);
                }
                (li as HTMLElement).focus(); cul = this.getUlByNavIdx();
                const index: number = this.isValidLI(cul.children[0], 0, this.action);
                cul.children[index].classList.add(FOCUSED); (cul.children[index] as HTMLElement).focus();
            }
        });
    }

    private collision(): void {
        let collide: string[];
        collide = isCollide(this.popupWrapper, null, this.left, this.top);
        if ((this.isNestedOrVertical || this.enableRtl) && (collide.indexOf('right') > -1
        || collide.indexOf('left') > -1)) {
            this.popupObj.collision.X = 'none';
            const offWidth: number =
            (closest(this.lItem, '.e-' + this.getModuleName() + '-wrapper') as HTMLElement).offsetWidth;
            this.left =
            this.enableRtl ? calculatePosition(this.lItem, this.isNestedOrVertical ? 'right' : 'left', 'top').left
                : this.left - this.popupWrapper.offsetWidth - offWidth + 2;
        }
        collide = isCollide(this.popupWrapper, null, this.left, this.top);
        if (collide.indexOf('left') > -1 || collide.indexOf('right') > -1) {
            this.left = this.callFit(this.popupWrapper, true, false, this.top, this.left).left;
        }
        this.popupWrapper.style.left = this.left + 'px';
    }
    
    protected setBlankIconStyle(menu: HTMLElement): void {
        const blankIconList: HTMLElement[] = [].slice.call(menu.getElementsByClassName('e-blankicon'));
        if (!blankIconList.length) { return; }
        const iconLi: HTMLElement = menu.querySelector('.e-menu-item:not(.e-blankicon):not(.e-separator)') as HTMLElement;
        const icon: HTMLElement = iconLi.querySelector('.e-menu-icon') as HTMLElement;
        if (!icon) { return; }
        const cssProp: { padding: string, margin: string } =  this.enableRtl ? { padding: 'paddingRight', margin: 'marginLeft' } :
            { padding: 'paddingLeft', margin: 'marginRight' };
        const iconCssProps: CSSStyleDeclaration = getComputedStyle(icon);
        let iconSize: number = parseInt(iconCssProps.fontSize, 10);
        if (!!parseInt(iconCssProps.width, 10) && parseInt(iconCssProps.width, 10) > iconSize) {
            iconSize = parseInt(iconCssProps.width, 10);
        }
        // eslint:disable
        const size: string = `${iconSize + parseInt(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (iconCssProps as any)[cssProp.margin], 10) + parseInt((getComputedStyle(iconLi) as any)[cssProp.padding], 10)}px`;
        blankIconList.forEach((li: HTMLElement): void => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (li.style as any)[cssProp.padding] = size;
        });
        // eslint:enable
    }

    private checkScrollOffset(e: MouseEvent | KeyboardEvent): void {
        const wrapper: Element = this.getWrapper();
        if (wrapper.children[0].classList.contains('e-menu-hscroll') && this.navIdx.length === 1) {
            const trgt: HTMLElement = isNullOrUndefined(e) ? this.element : closest(e.target as Element, '.' + ITEM) as HTMLElement;
            const offsetEle: HTMLElement = (select('.e-hscroll-bar', wrapper) as HTMLElement);
            if (offsetEle.scrollLeft > trgt.offsetLeft) {
                offsetEle.scrollLeft -= (offsetEle.scrollLeft - trgt.offsetLeft);
            }
            const offsetLeft: number = offsetEle.scrollLeft + offsetEle.offsetWidth;
            const offsetRight: number = trgt.offsetLeft + trgt.offsetWidth;
            if (offsetLeft < offsetRight) {
                offsetEle.scrollLeft += (offsetRight - offsetLeft);
            }
        }
    }

    private setPosition(li: Element, ul: HTMLElement, top: number, left: number): void {
        const px: string = 'px';
        this.toggleVisiblity(ul);
        if (ul === this.element || (left > -1 && top > -1)) {
            let collide: string[] = isCollide(ul, null, left, top);
            if (collide.indexOf('right') > -1) {
                left = left - ul.offsetWidth;
            }
            if (collide.indexOf('bottom') > -1) {
                const offset: OffsetPosition = this.callFit(ul, false, true, top, left);
                top = offset.top - 20;
                if (top < 0) {
                    const newTop: number = (pageYOffset + document.documentElement.clientHeight) - ul.getBoundingClientRect().height;
                    if (newTop > -1) { top = newTop; }
                }
            }
            collide = isCollide(ul, null, left, top);
            if (collide.indexOf('left') > -1) {
                const offset: OffsetPosition = this.callFit(ul, true, false, top, left);
                left = offset.left;
            }
        } else {
            if (Browser.isDevice) {
                top = Number(this.element.style.top.replace(px, ''));
                left = Number(this.element.style.left.replace(px, ''));
            } else {
                const x: string = this.enableRtl ? 'left' : 'right';
                let offset: OffsetPosition = calculatePosition(li, x, 'top');
                top = offset.top;
                left = offset.left;
                const collide: string[] = isCollide(ul, null, this.enableRtl ? left - ul.offsetWidth : left, top);
                const xCollision: boolean = collide.indexOf('left') > -1 || collide.indexOf('right') > -1;
                if (xCollision) {
                    offset = calculatePosition(li, this.enableRtl ? 'right' : 'left', 'top');
                    left = offset.left;
                }
                if (this.enableRtl || xCollision) {
                    left = (this.enableRtl && xCollision) ? left : left - ul.offsetWidth;
                }
                if (collide.indexOf('bottom') > -1) {
                    offset = this.callFit(ul, false, true, top, left);
                    top = offset.top;
                }
            }
        }
        this.toggleVisiblity(ul, false);
        ul.style.top = top + px;
        ul.style.left = left + px;
    }

    private toggleVisiblity(ul: HTMLElement, isVisible: boolean = true): void {
        ul.style.visibility = isVisible ? 'hidden' : '';
        ul.style.display = isVisible ? 'block' : 'none';
    }

    private createItems(items: MenuItemModel[] | objColl): HTMLElement {
        const level: number = this.navIdx ? this.navIdx.length : 0;
        const fields: FieldsMap = this.getFields(level);
        const showIcon: boolean = this.hasField(items, this.getField('iconCss', level));
        const listBaseOptions: ListBaseOptions = {
            showIcon: showIcon,
            moduleName: 'menu',
            fields: fields,
            template: this.template,
            itemNavigable: true,
            itemCreating: (args: { curData: obj, fields: obj }): void => {
                if (!args.curData[(<obj>args.fields)[fields.id] as string]) {
                    args.curData[(<obj>args.fields)[fields.id] as string] = getUniqueID('menuitem');
                }
                args.curData.htmlAttributes = {
                    role: 'menuitem',
                    tabindex: '-1'
                };
                if (this.isMenu && !(<obj>args.curData)[this.getField('separator', level)]) {
                    (<obj>args.curData.htmlAttributes)['aria-label'] = (<obj>args.curData)[args.fields.text as string];
                }
                if (args.curData[(<obj>args.fields)[fields.iconCss] as string] === '') {
                    args.curData[(<obj>args.fields)[fields.iconCss] as string] = null;
                }
            },
            itemCreated: (args: { curData: MenuItemModel | obj, item: Element, fields: obj }): void => {
                if ((<obj>args.curData)[this.getField('separator', level)]) {
                    args.item.classList.add(SEPARATOR);
                    args.item.removeAttribute('role');
                }
                if (showIcon && !(<obj>args.curData)[args.fields.iconCss as string]
                    && !(<obj>args.curData)[this.getField('separator', level)]) {
                    (args.item as HTMLElement).classList.add('e-blankicon');
                }
                if ((<obj>args.curData)[args.fields.child as string]
                    && (<objColl>(<obj>args.curData)[args.fields.child as string]).length) {
                    const span: Element = this.createElement('span', { className: ICONS + ' ' + CARET });
                    args.item.appendChild(span);
                    args.item.setAttribute('aria-haspopup', 'true');
                    args.item.setAttribute('aria-expanded', 'false');
                    if (!this.isMenu) {
                        args.item.removeAttribute('role');
                    }
                    (args.item as HTMLElement).classList.add('e-menu-caret-icon');
                }
                if (this.isMenu && this.template) {
                    args.item.setAttribute('id', (<obj>args.curData)[args.fields.id as string].toString());
                    args.item.removeAttribute('data-uid');
                    if (args.item.classList.contains('e-level-1')) { args.item.classList.remove('e-level-1'); }
                    if (args.item.classList.contains('e-has-child')) { args.item.classList.remove('e-has-child'); }
                }
                const eventArgs: MenuEventArgs = { item: args.curData, element: args.item as HTMLElement };
                this.trigger('beforeItemRender', eventArgs);
            }
        };
        this.setProperties({'items': this.items}, true);
        if (this.isMenu) {
            listBaseOptions.templateID = this.element.id + TEMPLATE_PROPERTY;
        }

        const ul: HTMLElement = ListBase.createList(
            this.createElement, items as objColl, listBaseOptions, !this.template, this);
        ul.setAttribute('tabindex', '0');
        if (this.isMenu) {
            ul.setAttribute('role', 'menu');
        }
        return ul;
    }

    private moverHandler(e: MouseEvent): void {
        const trgt: Element = e.target as Element;
        this.liTrgt = trgt;
        const cli: Element = this.getLI(trgt);
        const wrapper: Element = cli ? closest(cli, '.e-' + this.getModuleName() + '-wrapper') : this.getWrapper();
        const hdrWrapper: Element = this.getWrapper(); const regex: RegExp = new RegExp('-ej2menu-(.*)-popup'); let ulId: string;
        let isDifferentElem: boolean = false;
        if (!wrapper) {
            return;
        }
        if (wrapper.id !== '') {
            ulId = regex.exec(wrapper.id)[1];
        } else {
            ulId = wrapper.querySelector('ul').id;
        }
        if (ulId !== this.element.id) {
            this.removeLIStateByClass([FOCUSED, SELECTED], [this.getWrapper()]);
            if (this.navIdx.length) {
                isDifferentElem = true;
            } else {
                return;
            }
        }
        if (cli && closest(cli, '.e-' + this.getModuleName() + '-wrapper') && !isDifferentElem) {
            this.removeLIStateByClass([FOCUSED], this.isMenu ? [wrapper].concat(this.getPopups()) : [wrapper]);
            this.removeLIStateByClass([FOCUSED], this.isMenu ? [hdrWrapper].concat(this.getPopups()) : [hdrWrapper]);
            cli.classList.add(FOCUSED);
            if (!this.showItemOnClick) {
                this.clickHandler(e);
            }
        } else if (this.isMenu && this.showItemOnClick && !isDifferentElem) {
            this.removeLIStateByClass([FOCUSED], [wrapper].concat(this.getPopups()));
        }
        if (this.isMenu) {
            if (!this.showItemOnClick && (trgt.parentElement !== wrapper && !closest(trgt, '.e-' + this.getModuleName() + '-popup'))
                && (!cli || (cli && !this.getIndex(cli.id, true).length)) && this.showSubMenuOn !== 'Hover') {
                this.removeLIStateByClass([FOCUSED], [wrapper]);
                if (this.navIdx.length) {
                    this.isClosed = true;
                    this.closeMenu(null, e);
                }
            } else if (isDifferentElem && !this.showItemOnClick) {
                if (this.navIdx.length) {
                    this.isClosed = true;
                    this.closeMenu(null, e);
                }
            }
            if (!this.isClosed) {
                this.removeStateWrapper();
            }
            this.isClosed = false;
        }
    }
    private removeStateWrapper(): void {
        if (this.liTrgt) {
            const wrapper: Element = closest(this.liTrgt, '.e-menu-vscroll');
            if (this.liTrgt.tagName === 'DIV' && wrapper) {
                this.removeLIStateByClass([FOCUSED, SELECTED], [wrapper]);
            }
        }
    }

    private removeLIStateByClass(classList: string[], element: Element[]): void {
        let li: Element;
        for (let i: number = 0; i < element.length; i++) {
            classList.forEach((className: string) => {
                li = select('.' + className, element[i]);
                if (li) {
                    li.classList.remove(className);
                }
            });
        }
    }

    protected getField(propName: string, level: number = 0): string {
        const fieldName: object = (<obj>this.fields)[propName];
        return typeof fieldName === 'string' ? fieldName :
            (!(<obj>fieldName)[level] ? (fieldName as obj)[(<objColl>fieldName).length - 1].toString()
                : (<obj>fieldName)[level].toString());
    }

    private getFields(level: number = 0): FieldsMap {
        return {
            id: this.getField('itemId', level),
            iconCss: this.getField('iconCss', level),
            text: this.getField('text', level),
            url: this.getField('url', level),
            child: this.getField('children', level),
            separator: this.getField('separator', level)
        };
    }

    private hasField(items: MenuItemModel[], field: string): boolean {
        for (let i: number = 0, len: number = items.length; i < len; i++) {
            if ((<obj>items[i])[field]) {
                return true;
            }
        }
        return false;
    }

    private menuHeaderClickHandler(e: MouseEvent | KeyboardEvent): void {
        if (closest(e.target as Element, '.e-menu-wrapper').querySelector('ul.e-menu-parent').id !== this.element.id) {
            return;
        }
        if (this.element.classList.contains('e-hide-menu')) {
            this.openHamburgerMenu(e);
        } else {
            this.closeHamburgerMenu(e);
        }
    }

    private clickHandler(e: MouseEvent): void {
        if (this.isTapHold) {
            this.isTapHold = false;
        } else {
            const wrapper: Element = this.getWrapper();
            const trgt: Element = e.target as Element;
            const cli: Element = this.cli = this.getLI(trgt);
            const regex: RegExp = new RegExp('-ej2menu-(.*)-popup');
            const cliWrapper: Element = cli ? closest(cli, '.e-' + this.getModuleName() + '-wrapper') : null;
            const isInstLI: boolean = cli && cliWrapper && (this.isMenu ? this.getIndex(cli.id, true).length > 0
                : wrapper.firstElementChild.id === cliWrapper.firstElementChild.id);
            if (Browser.isDevice && this.isMenu) {
                this.removeLIStateByClass([FOCUSED], [wrapper].concat(this.getPopups()));
                this.mouseDownHandler(e);
            }
            if (cli && cliWrapper && this.isMenu) {
                const cliWrapperId: string = cliWrapper.id ? regex.exec(cliWrapper.id)[1] : cliWrapper.querySelector('.e-menu-parent').id;
                if (this.element.id !== cliWrapperId) {
                    return;
                }
            }
            if (isInstLI && e.type === 'click' && !cli.classList.contains(HEADER)) {
                this.setLISelected(cli);
                const navIdx: number[] = this.getIndex(cli.id, true);
                const item: MenuItemModel = this.getItem(navIdx);
                const eventArgs: MenuEventArgs = { element: cli as HTMLElement, item: item, event: e };
                this.trigger('select', eventArgs);
            }
            if (isInstLI && (e.type === 'mouseover' || Browser.isDevice || this.showItemOnClick)) {
                let ul: HTMLElement;
                if (cli.classList.contains(HEADER)) {
                    ul = wrapper.children[this.navIdx.length - 1] as HTMLElement;
                    this.toggleAnimation(ul);
                    const sli: Element = this.getLIByClass(ul, SELECTED);
                    if (sli) {
                        sli.classList.remove(SELECTED);
                    }
                    detach(cli.parentNode);
                    this.navIdx.pop();
                } else {
                    if (!cli.classList.contains(SEPARATOR)) {
                        this.showSubMenu = true;
                        const cul: Element = cli.parentNode as Element;
                        this.cliIdx = this.getIdx(cul, cli);
                        if (this.isMenu || !Browser.isDevice) {
                            const culIdx: number = this.isMenu ? Array.prototype.indexOf.call(
                                [wrapper].concat(this.getPopups()), closest(cul, '.' + 'e-' + this.getModuleName() + '-wrapper'))
                                : this.getIdx(wrapper, cul);
                            if (this.navIdx[culIdx] === this.cliIdx) {
                                this.showSubMenu = false;
                            }
                            if (culIdx !== this.navIdx.length && (e.type !== 'mouseover' || this.showSubMenu)) {
                                const sli: Element = this.getLIByClass(cul, SELECTED);
                                if (sli) {
                                    sli.classList.remove(SELECTED);
                                }
                                this.isClosed = true;
                                this.keyType = 'click';
                                if (this.showItemOnClick) { this.setLISelected(cli); }
                                this.closeMenu(culIdx + 1, e);
                                if (this.showItemOnClick) { this.setLISelected(cli); }
                            }
                        }
                        if (!this.isClosed) {
                            this.afterCloseMenu(e);
                        }
                        this.isClosed = false;
                    }
                }
            } else {
                if (this.isMenu && trgt.tagName === 'DIV' && this.navIdx.length && closest(trgt, '.e-menu-vscroll')) {
                    const popupEle: Element = closest(trgt, '.' + POPUP);
                    const cIdx: number = Array.prototype.indexOf.call(this.getPopups(), popupEle) + 1;
                    if (cIdx < this.navIdx.length) {
                        this.closeMenu(cIdx + 1, e);
                        if (popupEle) { this.removeLIStateByClass([FOCUSED, SELECTED], [popupEle]); }
                    }
                } else if (this.isMenu && this.hamburgerMode && trgt.tagName === 'SPAN'
                    && trgt.classList.contains('e-menu-icon')) {
                    this.menuHeaderClickHandler(e);
                } else {
                    if (trgt.tagName !== 'UL' || (this.isMenu ? trgt.parentElement.classList.contains('e-menu-wrapper') &&
                    !this.getIndex(trgt.querySelector('.' + ITEM).id, true).length : trgt.parentElement !== wrapper)) {
                        if (!cli) {
                            this.removeLIStateByClass([SELECTED], [wrapper]);
                        }
                        if (!cli || !cli.querySelector('.' + CARET)) {
                            this.closeMenu(null, e);
                        }
                    }
                }
            }
        }
    }
    private afterCloseMenu(e: MouseEvent): void {
        let isHeader: Element;
        if (this.showSubMenu) {
            if (this.showItemOnClick && this.navIdx.length === 0) {
                isHeader = closest(e.target as Element, '.e-menu-parent.e-control');
            } else {
                isHeader = closest(this.element, '.e-menu-parent.e-control');
            }
            const idx: number[] = this.navIdx.concat(this.cliIdx);
            const item: MenuItemModel = this.getItem(idx);
            if (item && (<objColl>(<obj>item)[this.getField('children', idx.length - 1)]) &&
                (<objColl>(<obj>item)[this.getField('children', idx.length - 1)]).length) {
                if (e.type === 'mouseover' || (Browser.isDevice && this.isMenu)) {
                    this.setLISelected(this.cli);
                }
                if ((!this.hamburgerMode && isHeader) || (this.hamburgerMode && this.cli.getAttribute('aria-expanded') === 'false')) {
                    this.cli.setAttribute('aria-expanded', 'true');
                    this.navIdx.push(this.cliIdx);
                    this.openMenu(this.cli, item, null, null, e);
                }
            } else {
                if (e.type !== 'mouseover') {
                    this.closeMenu(null, e);
                }
            }
            if (!isHeader) {
                const cul: Element = this.getUlByNavIdx();
                const sli: Element = this.getLIByClass(cul, SELECTED);
                if (sli) {
                    sli.setAttribute('aria-expanded', 'false');
                    sli.classList.remove(SELECTED);
                }
            }
        }
        this.keyType = '';
    }
    private setLISelected(li: Element): void {
        const sli: Element = this.getLIByClass(li.parentElement, SELECTED);
        if (sli) {
            sli.classList.remove(SELECTED);
        }
        if (!this.isMenu) {
            li.classList.remove(FOCUSED);
        }
        li.classList.add(SELECTED);
    }

    private getLIByClass(ul: Element, classname: string): Element {
        for (let i: number = 0, len: number = ul.children.length; i < len; i++) {
            if (ul.children[i].classList.contains(classname)) {
                return ul.children[i];
            }
        }
        return null;
    }

    /**
     * This method is used to get the index of the menu item in the Menu based on the argument.
     *
     * @param {MenuItem | string} item - item be passed to get the index | id to be passed to get the item index.
     * @param {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    public getItemIndex(item: MenuItem | string, isUniqueId?: boolean): number[] {
        let idx: string;
        if (typeof item === 'string') {
            idx = item;
        } else {
            idx = item.id;
        }
        const isText: boolean = (isUniqueId === false) ? false : true;
        const navIdx: number[] = this.getIndex(idx, isText);
        return navIdx;
    }

    /**
     * This method is used to set the menu item in the Menu based on the argument.
     *
     * @param {MenuItem} item - item need to be updated.
     * @param {string} id - id to be passed to update the item.
     * @param {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    public setItem(item: MenuItem, id?: string, isUniqueId?: boolean): void {
        const idx: string = id ? id : item.id;
        const isText: boolean = (isUniqueId === false) ? false : true;
        const navIdx: number[] = this.getIndex(idx, isText);
        const newItem: MenuItemModel = this.getItem(navIdx);
        newItem.iconCss = item.iconCss;
        newItem.id = item.id;
        newItem.text = item.text;
        newItem.url = item.url;
        newItem.separator = item.separator;
        newItem.items = item.items;
    }

    private getItem(navIdx: number[]): MenuItemModel {
        navIdx = navIdx.slice();
        const idx: number = navIdx.pop();
        const items: MenuItemModel[] = this.getItems(navIdx);
        return items[idx];
    }

    private getItems(navIdx: number[]): objColl {
        let items: objColl = this.items as objColl;
        for (let i: number = 0; i < navIdx.length; i++) {
            items = (<obj>items[navIdx[i]])[this.getField('children', i)] as objColl;
        }
        return items;
    }

    private setItems(newItems: objColl, navIdx: number[]): void {
        const items: objColl = this.getItems(navIdx);
        items.splice(0, items.length);
        for (let i: number = 0; i < newItems.length; i++) {
            items.splice(i, 0, newItems[i]);
        }
    }

    private getIdx(ul: Element, li: Element, skipHdr: boolean = true): number {
        let idx: number = Array.prototype.indexOf.call(ul.children, li);
        if (skipHdr && ul.children[0].classList.contains(HEADER)) {
            idx--;
        }
        return idx;
    }

    private getLI(elem: Element): Element {
        if (elem.tagName === 'LI' && elem.classList.contains('e-menu-item')) {
            return elem;
        }
        return closest(elem, 'li.e-menu-item');
    }

    private updateItemsByNavIdx(): void {
        let items: MenuItemModel[] = this.items; let count: number = 0;
        for (let index: number = 0; index < this.navIdx.length; index++) {
            items = items[index].items;
            if (!items) { break; }
            count++;
            const ul: HTMLUListElement = <HTMLUListElement>this.getUlByNavIdx(count);
            if (!ul) { break; }
            this.updateItem(ul, items);
        }
    }

    private removeChildElement(elem: HTMLUListElement): HTMLUListElement {
        while (elem.firstElementChild) {
            elem.removeChild(elem.firstElementChild);
        }
        return elem;
    }
    /**
     * Called internally if any of the property value changed.
     *
     * @private
     * @param {MenuBaseModel} newProp - Specifies the new properties
     * @param {MenuBaseModel} oldProp - Specifies the old properties
     * @returns {void}
     */
    public onPropertyChanged(newProp: MenuBaseModel, oldProp: MenuBaseModel): void {
        const wrapper: HTMLElement = this.getWrapper() as HTMLElement;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'cssClass':
                if (oldProp.cssClass) {
                    removeClass([wrapper], oldProp.cssClass.split(' '));
                }
                if (newProp.cssClass) {
                    addClass([wrapper], newProp.cssClass.split(' '));
                }
                break;
            case 'enableRtl':
                wrapper.classList.toggle(RTL);
                break;
            case 'showItemOnClick':
                this.unWireEvents();
                this.showItemOnClick = newProp.showItemOnClick;
                this.wireEvents();
                break;
            case 'enableScrolling':
                if (newProp.enableScrolling) {
                    let ul: HTMLElement;
                    if (this.element.classList.contains('e-vertical')) {
                        addScrolling(this.createElement, wrapper, this.element, 'vscroll', this.enableRtl);
                    } else {
                        addScrolling(this.createElement, wrapper, this.element, 'hscroll', this.enableRtl);
                    }
                    (this.getPopups() as HTMLElement[]).forEach((wrapper: HTMLElement) => {
                        ul = select('.e-ul', wrapper) as HTMLElement;
                        addScrolling(this.createElement, wrapper, ul, 'vscroll', this.enableRtl);
                    });
                } else {
                    let ul: HTMLElement = wrapper.children[0] as HTMLElement;
                    if (this.element.classList.contains('e-vertical')) {
                        destroyScroll(getInstance(ul, VScroll) as VScroll, ul);
                    } else {
                        destroyScroll(getInstance(ul, HScroll) as HScroll, ul);
                    }
                    wrapper.style.overflow = '';
                    wrapper.appendChild(this.element);
                    (this.getPopups() as HTMLElement[]).forEach((wrapper: HTMLElement) => {
                        ul = wrapper.children[0] as HTMLElement;
                        destroyScroll(getInstance(ul, VScroll) as VScroll, ul);
                        wrapper.style.overflow = '';
                    });
                }
                break;
            case 'items': {
                let idx: number;
                let navIdx: number[];
                let item: MenuItemModel[];
                if (!Object.keys(oldProp.items).length) {
                    this.updateItem(this.element, this.items);
                    if (!this.hamburgerMode) {
                        for (let i: number = 1, count: number = wrapper.childElementCount; i < count; i++) {
                            detach(wrapper.lastElementChild);
                        }
                    }
                    this.navIdx = [];
                } else {
                    const keys: string[] = Object.keys(newProp.items);
                    for (let i: number = 0; i < keys.length; i++) {
                        navIdx = this.getChangedItemIndex(newProp, [], Number(keys[i]));
                        if (navIdx.length <= this.getWrapper().children.length) {
                            idx = navIdx.pop();
                            item = this.getItems(navIdx);
                            this.insertAfter([item[idx]], item[idx].text);
                            this.removeItem(item, navIdx, idx);
                            this.setItems(item as objColl, navIdx);
                        }
                        navIdx.length = 0;
                    }
                }
                break;
            }
            }
        }
    }

    private updateItem(ul: HTMLUListElement, items: MenuItemModel[]): void {
        if (isBlazor() && !this.isMenu) {
            ul = this.removeChildElement(ul);
        } else {
            ul.innerHTML = '';
        }
        const lis: HTMLElement[] = [].slice.call(this.createItems(items).children);
        lis.forEach((li: HTMLElement): void => {
            ul.appendChild(li);
        });
    }

    private getChangedItemIndex(newProp: MenuBaseModel, index: number[], idx: number): number[] {
        index.push(idx);
        const key: string = Object.keys((<objColl>newProp.items)[idx]).pop();
        if (key === 'items') {
            const item: MenuItemModel = (<objColl>newProp.items)[idx];
            const popStr: string = Object.keys(item.items).pop();
            if (popStr) {
                this.getChangedItemIndex(item, index, Number(popStr));
            }
        } else {
            if (key === 'isParentArray' && index.length > 1) {
                index.pop();
            }
        }
        return index;
    }

    private removeItem(item: MenuItemModel[], navIdx: number[], idx: number): void {
        item.splice(idx, 1);
        const uls: HTMLCollection = this.getWrapper().children;
        if (navIdx.length < uls.length) {
            detach(uls[navIdx.length].children[idx]);
        }
    }

    /**
     * Used to unwire the bind events.
     *
     * @private
     * @param {string} targetSelctor - Specifies the target selector
     * @returns {void}
     */
    protected unWireEvents(targetSelctor: string = this.target): void {
        const wrapper: HTMLElement = this.getWrapper() as HTMLElement;
        if (targetSelctor) {
            let target: HTMLElement;
            let touchModule: Touch;
            const targetElems: HTMLElement[] = selectAll(targetSelctor);
            for (let i: number = 0, len: number = targetElems.length; i < len; i++) {
                target = targetElems[i];
                if (this.isMenu) {
                    EventHandler.remove(target, 'click', this.menuHeaderClickHandler);
                } else {
                    if (Browser.isIos) {
                        touchModule = getInstance(target, Touch) as Touch;
                        if (touchModule) {
                            touchModule.destroy();
                        }
                    } else {
                        EventHandler.remove(target, 'contextmenu', this.cmenuHandler);
                    }
                }
            }
            if (!this.isMenu) {
                EventHandler.remove(this.targetElement, 'scroll', this.scrollHandler);
                for (const parent of getScrollableParent(this.targetElement)) {
                    EventHandler.remove(parent, 'scroll', this.scrollHandler);
                }
            }
        }
        if (!Browser.isDevice) {
            EventHandler.remove(this.isMenu ? document : wrapper, 'mouseover', this.delegateMoverHandler);
            EventHandler.remove(document, 'mousedown', this.delegateMouseDownHandler);
        }
        EventHandler.remove(document, 'click', this.delegateClickHandler);
        this.unWireKeyboardEvent(wrapper);
        this.rippleFn();
    }

    private unWireKeyboardEvent(element: HTMLElement): void {
        const keyboardModule: KeyboardEvents = getInstance(element, KeyboardEvents) as KeyboardEvents;
        if (keyboardModule) {
            keyboardModule.destroy();
        }
    }

    private toggleAnimation(ul: HTMLElement, isMenuOpen: boolean = true): void {
        let pUlHeight: number;
        let pElement: HTMLElement;
        if (this.animationSettings.effect === 'None' || !isMenuOpen) {
            this.end(ul, isMenuOpen);
        } else {
            this.animation.animate(ul, {
                name: this.animationSettings.effect,
                duration: this.animationSettings.duration,
                timingFunction: this.animationSettings.easing,
                begin: (options: AnimationOptions) => {
                    if (this.hamburgerMode) {
                        pElement = options.element.parentElement;
                        options.element.style.position = 'absolute';
                        pUlHeight = pElement.offsetHeight;
                        options.element.style.maxHeight = options.element.offsetHeight + 'px';
                        pElement.style.maxHeight = '';
                    } else {
                        options.element.style.display = 'block';
                        options.element.style.maxHeight = options.element.getBoundingClientRect().height + 'px';
                    }
                },
                progress: (options: AnimationOptions) => {
                    if (this.hamburgerMode) {
                        pElement.style.minHeight = (pUlHeight + options.element.offsetHeight) + 'px';
                    }
                },
                end: (options: AnimationOptions) => {
                    if (this.hamburgerMode) {
                        options.element.style.position = '';
                        options.element.style.maxHeight = '';
                        pElement.style.minHeight = '';
                        options.element.style.top = 0 + 'px';
                        (options.element.children[0] as HTMLElement).focus();
                        this.triggerOpen(options.element.children[0] as HTMLElement);
                    } else {
                        this.end(options.element, isMenuOpen);
                    }
                }
            });
        }
    }

    private triggerOpen(ul: HTMLElement): void {
        const item: MenuItemModel = this.navIdx.length ? this.getItem(this.navIdx) : null;
        const eventArgs: OpenCloseMenuEventArgs = {
            element: ul, parentItem: item, items: item ? item.items : this.items as objColl
        };
        this.trigger('onOpen', eventArgs);
    }

    private end(ul: HTMLElement, isMenuOpen: boolean): void {
        if (isMenuOpen) {
            ul.style.display = 'block';
            ul.style.maxHeight = '';
            this.triggerOpen(ul);
            if (ul.querySelector('.' + FOCUSED)) {
                (ul.querySelector('.' + FOCUSED) as HTMLElement).focus();
            } else {
                const ele: HTMLElement = this.getWrapper().children[this.getIdx(this.getWrapper(), ul) - 1] as HTMLElement;
                if (ele) {
                    (ele.querySelector('.' + SELECTED) as HTMLElement).focus();
                } else {
                    this.element.focus();
                }
            }
        } else {
            if (ul === this.element) {
                const fli: Element = this.getLIByClass(this.element, FOCUSED);
                if (fli) {
                    fli.classList.remove(FOCUSED);
                }
                const sli: Element = this.getLIByClass(this.element, SELECTED);
                if (sli) {
                    sli.classList.remove(SELECTED);
                }
                ul.style.display = 'none';
            } else {
                detach(ul);
            }
        }
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist data
     */
    protected getPersistData(): string {
        return '';
    }

    /**
     * Get wrapper element.
     *
     * @returns {Element} - Wrapper element
     * @private
     */
    private getWrapper(): Element {
        return closest(this.element, '.e-' + this.getModuleName() + '-wrapper');
    }

    protected getIndex(
        data: string, isUniqueId?: boolean, items: MenuItemModel[] | { [key: string]: Object }[] = this.items as objColl,
        nIndex: number[] = [], isCallBack: boolean = false, level: number = 0): number[] {
        let item: MenuItemModel | obj;
        level = isCallBack ? level + 1 : 0;
        for (let i: number = 0, len: number = items.length; i < len; i++) {
            item = items[i];
            if ((isUniqueId ? (<obj>item)[this.getField('itemId', level)] : (<obj>item)[this.getField('text', level)]) === data) {
                nIndex.push(i);
                break;
            } else if ((<objColl>(<obj>item)[this.getField('children', level)])
                && (<objColl>(<obj>item)[this.getField('children', level)]).length) {
                nIndex = this.getIndex(data, isUniqueId, (<objColl>(<obj>item)[this.getField('children', level)]), nIndex, true, level);
                if (nIndex[nIndex.length - 1] === -1) {
                    if (i !== len - 1) {
                        nIndex.pop();
                    }
                } else {
                    nIndex.unshift(i);
                    break;
                }
            } else {
                if (i === len - 1) {
                    nIndex.push(-1);
                }
            }
        }
        return (!isCallBack && nIndex[0] === -1) ? [] : nIndex;
    }

    /**
     * This method is used to enable or disable the menu items in the Menu based on the items and enable argument.
     *
     * @param {string[]} items - Text items that needs to be enabled/disabled.
     * @param {boolean} enable - Set `true`/`false` to enable/disable the list items.
     * @param {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    public enableItems(items: string[], enable: boolean = true, isUniqueId?: boolean): void {
        let ul: Element;
        let idx: number;
        let navIdx: number[];
        const disabled: string = DISABLED; let skipItem: boolean;
        for (let i: number = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i], isUniqueId);
            if (this.navIdx.length) {
                if (navIdx.length !== 1) {
                    skipItem = false;
                    for (let i: number = 0, len: number = navIdx.length - 1; i < len; i++) {
                        if (navIdx[i] !== this.navIdx[i]) {
                            skipItem = true; break;
                        }
                    }
                    if (skipItem) { continue; }
                }
            } else {
                if (navIdx.length !== 1) { continue; }
            }
            idx = navIdx.pop();
            ul = this.getUlByNavIdx(navIdx.length);
            if (ul) {
                if (enable) {
                    if (this.isMenu) {
                        ul.children[idx].classList.remove(disabled);
                        ul.children[idx].removeAttribute('aria-disabled');
                    } else {
                        if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                            ul.children[idx + 1].classList.remove(disabled);
                        } else {
                            ul.children[idx].classList.remove(disabled);
                        }
                    }
                } else {
                    if (this.isMenu) {
                        ul.children[idx].classList.add(disabled);
                        ul.children[idx].setAttribute('aria-disabled', 'true');
                    } else {
                        if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                            ul.children[idx + 1].classList.add(disabled);
                        } else {
                            ul.children[idx].classList.add(disabled);
                        }
                    }
                }
            }
        }
    }

    /**
     * This method is used to show the menu items in the Menu based on the items text.
     *
     * @param {string[]} items - Text items that needs to be shown.
     * @param {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    public showItems(items: string[], isUniqueId?: boolean): void {
        this.showHideItems(items, false, isUniqueId);
    }

    /**
     * This method is used to hide the menu items in the Menu based on the items text.
     *
     * @param {string[]} items - Text items that needs to be hidden.
     * @param {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    public hideItems(items: string[], isUniqueId?: boolean): void {
        this.showHideItems(items, true, isUniqueId);
    }

    private showHideItems(items: string[], ishide: boolean, isUniqueId?: boolean): void {
        let ul: Element;
        let index: number;
        let navIdx: number[];
        for (let i: number = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i], isUniqueId);
            index = navIdx.pop();
            ul = this.getUlByNavIdx(navIdx.length);
            if (ul) {
                if (ishide) {
                    if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                        ul.children[index + 1].classList.add(HIDE);
                    } else {
                        ul.children[index].classList.add(HIDE);
                    }
                } else {
                    if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                        ul.children[index + 1].classList.remove(HIDE);
                    } else {
                        ul.children[index].classList.remove(HIDE);
                    }
                }
            }
        }
    }

    /**
     * It is used to remove the menu items from the Menu based on the items text.
     *
     * @param {string[]} items Text items that needs to be removed.
     * @param {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    public removeItems(items: string[], isUniqueId?: boolean): void {
        let idx: number;
        let navIdx: number[];
        let iitems: MenuItemModel[];
        for (let i: number = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i], isUniqueId);
            idx = navIdx.pop();
            iitems = this.getItems(navIdx);
            this.removeItem(iitems, navIdx, idx);
        }
    }

    /**
     * It is used to insert the menu items after the specified menu item text.
     *
     * @param {MenuItemModel[]} items - Items that needs to be inserted.
     * @param {string} text - Text item after that the element to be inserted.
     * @param {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    public insertAfter(items: MenuItemModel[], text: string, isUniqueId?: boolean): void {
        this.insertItems(items, text, isUniqueId);
    }

    /**
     * It is used to insert the menu items before the specified menu item text.
     *
     * @param {MenuItemModel[]} items - Items that needs to be inserted.
     * @param {string} text - Text item before that the element to be inserted.
     * @param  {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    public insertBefore(items: MenuItemModel[], text: string, isUniqueId?: boolean): void {
        this.insertItems(items, text, isUniqueId, false);
    }

    private insertItems(items: MenuItemModel[] | objColl, text: string, isUniqueId?: boolean, isAfter: boolean = true): void {
        let li: Element;
        let idx: number;
        let navIdx: number[];
        let iitems: MenuItemModel[];
        let menuitem: MenuItem;
        for (let i: number = 0; i < items.length; i++) {
            navIdx = this.getIndex(text, isUniqueId);
            idx = navIdx.pop();
            iitems = this.getItems(navIdx);
            menuitem = new MenuItem(iitems[0] as MenuItem, 'items', items[i], true);
            iitems.splice(isAfter ? idx + 1 : idx, 0, menuitem);
            const uls: Element[] = this.isMenu ? [this.getWrapper()].concat(this.getPopups()) : [].slice.call(this.getWrapper().children);
            if (navIdx.length < uls.length) {
                idx = isAfter ? idx + 1 : idx;
                li = this.createItems(iitems).children[idx];
                const ul: Element = this.isMenu ? select('.e-menu-parent', uls[navIdx.length]) : uls[navIdx.length];
                ul.insertBefore(li, ul.children[idx]);
            }
        }
    }

    private removeAttributes(): void {
        ['top', 'left', 'display', 'z-index'].forEach((key: string) => {
            this.element.style.removeProperty(key);
        });
        ['role', 'tabindex', 'class', 'style'].forEach((key: string) => {
            if (key === 'class' && this.element.classList.contains('e-menu-parent')) {
                this.element.classList.remove('e-menu-parent');
            }
            if (['class', 'style'].indexOf(key) === -1 || !this.element.getAttribute(key)) {
                this.element.removeAttribute(key);
            }
            if (this.isMenu && key === 'class' && this.element.classList.contains('e-vertical')) {
                this.element.classList.remove('e-vertical');
            }
        });
    }

    /**
     * Destroys the widget.
     *
     * @returns {void}
     */

    public destroy(): void {
        const wrapper: Element = this.getWrapper();
        if (wrapper) {
            this.unWireEvents();
            if (!this.isMenu) {
                this.clonedElement.style.display = '';
                if (this.clonedElement.tagName === 'EJS-CONTEXTMENU') {
                    addClass([this.clonedElement], ['e-control', 'e-lib', 'e-' + this.getModuleName()]);
                    this.element = this.clonedElement as HTMLUListElement;
                } else {
                    if (this.refreshing && this.clonedElement.childElementCount && this.clonedElement.children[0].tagName === 'LI') {
                        this.setProperties({ 'items': [] }, true);
                    }
                    if (document.getElementById(this.clonedElement.id)) {
                        const refEle: Element = this.clonedElement.nextElementSibling;
                        if (refEle && refEle !== wrapper) {
                            this.clonedElement.parentElement.insertBefore(this.element, refEle);
                        } else {
                            this.clonedElement.parentElement.appendChild(this.element);
                        }
                        if (isBlazor() && !this.isMenu) {
                            this.element = this.removeChildElement(this.element);
                        } else {
                            this.element.innerHTML = '';
                        }
                        append([].slice.call(this.clonedElement.children), this.element);
                        detach(this.clonedElement);
                        this.removeAttributes();
                    }
                }
                this.clonedElement = null;
            } else {
                this.closeMenu();
                if (isBlazor() && !this.isMenu) {
                    this.element = this.removeChildElement(this.element);
                } else {
                    this.element.innerHTML = '';
                }
                this.removeAttributes();
                wrapper.parentNode.insertBefore(this.element, wrapper);
                this.clonedElement = null;
            }
            if (this.isMenu && this.clonedElement) {
                detach(this.element);
                (wrapper as HTMLElement).style.display = '';
                wrapper.classList.remove('e-' + this.getModuleName() + '-wrapper');
                wrapper.removeAttribute('data-ripple');
            } else {
                detach(wrapper);
            }
            super.destroy();
            if (this.template) { this.clearTemplate(['template']); }
        }
    }
}

interface FieldsMap {
    id: string;
    iconCss: string;
    text: string;
    url: string;
    child: string;
    separator: string;
}

/**
 * Interface for before item render/select event.
 */
export interface MenuEventArgs extends BaseEventArgs {
    element: HTMLElement;
    item: MenuItemModel;
    event?: Event;
}

/**
 * Interface for before open/close event.
 */
export interface BeforeOpenCloseMenuEventArgs extends BaseEventArgs {
    element: HTMLElement;
    items: MenuItemModel[];
    parentItem: MenuItemModel;
    event: Event;
    cancel: boolean;
    top?: number;
    left?: number;
    isFocused?: boolean;
    showSubMenuOn?: MenuOpenType;
}

/**
 * Interface for open/close event.
 */
export interface OpenCloseMenuEventArgs extends BaseEventArgs {
    element: HTMLElement;
    items: MenuItemModel[] | { [key: string]: Object }[];
    parentItem: MenuItemModel;
}
