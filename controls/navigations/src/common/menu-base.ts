import { Component, Property, ChildProperty, NotifyPropertyChanges, INotifyPropertyChanged, AnimationModel } from '@syncfusion/ej2-base';
import { Event, EventHandler, EmitType, BaseEventArgs, KeyboardEvents, KeyboardEventArgs, Touch, TapEventArgs } from '@syncfusion/ej2-base';
import { attributes, Animation, AnimationOptions, TouchEventArgs, MouseEventArgs } from '@syncfusion/ej2-base';
import { Browser, Collection, setValue, getValue, getUniqueID, getInstance, isNullOrUndefined } from '@syncfusion/ej2-base';
import { select, selectAll, closest, detach, append, rippleEffect, isVisible, Complex, addClass, removeClass } from '@syncfusion/ej2-base';
import { ListBase, ListBaseOptions } from '@syncfusion/ej2-lists';
import { getZindexPartial, calculatePosition, OffsetPosition, isCollide, flip, fit, Popup } from '@syncfusion/ej2-popups';
import { updateBlazorTemplate, resetBlazorTemplate, blazorTemplates, extend } from '@syncfusion/ej2-base';
import { getScrollableParent } from '@syncfusion/ej2-popups';
import { MenuItemModel, MenuBaseModel, FieldSettingsModel, MenuAnimationSettingsModel } from './menu-base-model';
import { HScroll } from '../common/h-scroll';
import { VScroll } from '../common/v-scroll';

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
 * Menu animation effects
 */
export type MenuEffect = 'None' | 'SlideDown' | 'ZoomIn' | 'FadeIn';

/**   
 * Configures the field options of the Menu.
 */
export class FieldSettings extends ChildProperty<FieldSettings> {

    /**
     * Specifies the itemId field for Menu item.
     * @default 'id'
     */
    @Property('id')
    public itemId: string | string[];

    /**
     * Specifies the parentId field for Menu item.
     * @default 'parentId'
     */
    @Property('parentId')
    public parentId: string | string[];

    /**
     * Specifies the text field for Menu item.
     * @default 'text'
     */
    @Property('text')
    public text: string | string[];

    /**
     * Specifies the css icon field for Menu item.
     * @default 'iconCss'
     */
    @Property('iconCss')
    public iconCss: string | string[];

    /**     
     * Specifies the Url field for Menu item.
     * @default 'url'
     */
    @Property('url')
    public url: string | string[];

    /**     
     * Specifies the separator field for Menu item.
     * @default 'separator'
     */
    @Property('separator')
    public separator: string | string[];

    /**
     * Specifies the children field for Menu item. 
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
     * @default null
     */
    @Property(null)
    public iconCss: string;

    /**
     * Specifies the id for menu item.
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies separator between the menu items. Separator are either horizontal or vertical lines used to group menu items.
     * @default false
     */
    @Property(false)
    public separator: boolean;

    /**
     * Specifies the sub menu items that is the array of MenuItem model.
     * @default []
     */
    @Collection<MenuItemModel>([], MenuItem)
    public items: MenuItemModel[];

    /**
     * Specifies text for menu item.
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Specifies url for menu item that creates the anchor link to navigate to the url provided.
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
     * @default 'SlideDown'
     * @aspType Syncfusion.EJ2.Navigations.MenuEffect
     * @blazorType Syncfusion.EJ2.Navigations.MenuEffect
     * @isEnumeration true
     */
    @Property('SlideDown')
    public effect: MenuEffect;
    /**
     * Specifies the time duration to transform object.
     * @default 400
     */
    @Property(400)
    public duration: number;
    /**
     * Specifies the easing effect applied while transform.
     * @default 'ease'
     */
    @Property('ease')
    public easing: string;
}

/**
 * @private
 * Base class for Menu and ContextMenu components.
 */
@NotifyPropertyChanges
export abstract class MenuBase extends Component<HTMLUListElement> implements INotifyPropertyChanged {
    private clonedElement: HTMLElement;
    private targetElement: HTMLElement;
    private delegateClickHandler: Function;
    private delegateMoverHandler: Function;
    private delegateMouseDownHandler: Function;
    private navIdx: number[] = [];
    private animation: Animation = new Animation({});
    private isTapHold: boolean = false;
    protected isMenu: boolean;
    protected hamburgerMode: boolean;
    protected title: string;
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
    /**
     * Triggers while rendering each menu item.
     * @event
     * @blazorProperty 'OnItemRender'
     */
    @Event()
    public beforeItemRender: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the menu item.
     * @event
     * @blazorProperty 'OnOpen'
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while opening the menu item.
     * @event
     * @blazorProperty 'Opened'
     */
    @Event()
    public onOpen: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the menu.
     * @event
     * @blazorProperty 'OnClose'
     */
    @Event()
    public beforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while closing the menu.
     * @event
     * @blazorProperty 'Closed'
     */
    @Event()
    public onClose: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting menu item.
     * @event
     * @blazorProperty 'ItemSelected'
     */
    @Event()
    public select: EmitType<MenuEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Defines class/multiple classes separated by a space in the Menu wrapper.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies whether to show the sub menu or not on click.
     * When set to true, the sub menu will open only on mouse click.
     * @default false
     */
    @Property(false)
    public showItemOnClick: boolean;

    /**
     * Specifies target element selector in which the ContextMenu should be opened.
     * Specifies target element to open/close Menu while click in Hamburger mode.
     * @default ''
     * @private
     */
    @Property('')
    public target: string;

    /**
     * Specifies the filter selector for elements inside the target in that the context menu will be opened.
     * Not applicable to Menu component.
     * @default ''
     * @private
     */
    @Property('')
    public filter: string;

    /**
     * Specifies the template for Menu item.
     * Not applicable to ContextMenu component.
     * @default null
     * @private
     */
    @Property(null)
    public template: string;

    /**
     * Specifies whether to enable / disable the scrollable option in Menu.
     * Not applicable to ContextMenu component.
     * @default false
     * @private
     */
    @Property(false)
    public enableScrolling: boolean;

    /**
     * Specifies mapping fields from the dataSource.
     * Not applicable to ContextMenu component.
     * @default { itemId: "id", text: "text", parentId: "parentId", iconCss: "iconCss", url: "url", separator: "separator",
     * children: "items" }
     * @private
     */
    @Complex<FieldSettingsModel>({}, FieldSettings)
    public fields: FieldSettingsModel;

    /**
     * Specifies menu items with its properties which will be rendered as Menu.
     * @default []
     */
    @Collection<MenuItemModel>([], MenuItem)
    public items: MenuItemModel[] | { [key: string]: Object }[];

    /**
     * Specifies the animation settings for the sub menu open.
     * @default { duration: 400, easing: 'ease', effect: 'SlideDown' }
     */
    @Complex<MenuAnimationSettingsModel>({}, MenuAnimationSettings)
    public animationSettings: MenuAnimationSettingsModel;

    /**
     * Constructor for creating the widget.
     * @private
     */
    constructor(options?: MenuBaseModel, element?: string | HTMLUListElement) {
        super(options, <HTMLUListElement | string>element);
    }

    /**
     * Initialized third party configuration settings.
     * @private
     */
    protected preRender(): void {
        if (!this.isMenu) {
            let ul: HTMLUListElement;
            if (this.element.tagName === 'EJS-CONTEXTMENU') {
                ul = this.createElement('ul', {
                    id: getUniqueID(this.getModuleName()), className: 'e-control e-lib e-' + this.getModuleName() }) as HTMLUListElement;
                let ejInst: Object = getValue('ej2_instances', this.element);
                removeClass([this.element], ['e-control', 'e-lib', 'e-' + this.getModuleName()]);
                this.clonedElement = this.element; this.element = ul;
                setValue('ej2_instances', ejInst, this.element);
            } else {
                ul = this.createElement('ul', { id: getUniqueID(this.getModuleName()) }) as HTMLUListElement;
                append([].slice.call((this.element.cloneNode(true) as Element).children), ul);
                let refEle: Element = this.element.nextElementSibling;
                refEle ? this.element.parentElement.insertBefore(ul, refEle) : this.element.parentElement.appendChild(ul);
                this.clonedElement = ul;
            }
            this.clonedElement.style.display = 'none';
        }
        if (this.element.tagName === 'EJS-MENU') {
            let ele: Element = this.element;
            let ejInstance: Object = getValue('ej2_instances', ele);
            let ul: Element = this.createElement('ul');
            let wrapper: HTMLElement = this.createElement('EJS-MENU', { className: 'e-' + this.getModuleName() + '-wrapper' });
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
     * Initialize the control rendering
     * @private
     */
    protected render(): void {
        this.initialize();
        this.renderItems();
        if (this.isMenu && this.template && this.isBlazor()) {
            let menuTemplateId: string = this.element.id + TEMPLATE_PROPERTY;
            resetBlazorTemplate(menuTemplateId, TEMPLATE_PROPERTY);
            if (Object.keys(blazorTemplates).length) {
                extend(this.tempItem, (<{ [key: string]: Object }>blazorTemplates)[menuTemplateId], [], true);
            }
            updateBlazorTemplate(menuTemplateId, TEMPLATE_PROPERTY, this);
        }
        this.wireEvents();
        this.renderComplete();
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
    }

    private renderItems(): void {
        if (!(this.items as objColl).length) {
            let items: { [key: string]: Object; }[] = ListBase.createJsonFromElement(this.element, { fields: { child: 'items' } });
            this.setProperties({ items: items }, true);
            if (this.isBlazor()) {
                this.element = this.removeChildElement(this.element);
            } else {
                this.element.innerHTML = '';
            }
        }
        let ul: Element = this.createItems(this.items as objColl);
        append(Array.prototype.slice.call(ul.children), this.element);
        this.element.classList.add('e-menu-parent');
        let wrapper: HTMLElement = this.getWrapper() as HTMLElement;
        this.element.classList.contains('e-vertical') ?
            this.addScrolling(wrapper, this.element, 'vscroll', wrapper.offsetHeight, this.element.offsetHeight)
            : this.addScrolling(wrapper, this.element, 'hscroll', wrapper.offsetWidth, this.element.offsetWidth);
    }

    protected wireEvents(): void {
        let wrapper: HTMLElement = this.getWrapper() as HTMLElement;
        if (this.target) {
            let target: HTMLElement;
            let targetElems: HTMLElement[] = selectAll(this.target);
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
                for (let parent of getScrollableParent(this.targetElement)) {
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
        let keyConfigs: { [key: string]: string; } = {
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
        let trgt: Element = e.target as Element;
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
        let cul: Element = this.getUlByNavIdx();
        let defaultIdx: number = (e.action === DOWNARROW || e.action === HOME) ? 0 : cul.childElementCount - 1;
        let fliIdx: number = defaultIdx;
        let fli: Element = this.getLIByClass(cul, FOCUSED);
        if (fli) {
            if (e.action !== END && e.action !== HOME) {
                fliIdx = this.getIdx(cul, fli);
            }
            fli.classList.remove(FOCUSED);
            if (e.action !== END && e.action !== HOME) {
                e.action === DOWNARROW ? fliIdx++ : fliIdx--;
                if (fliIdx === (e.action === DOWNARROW ? cul.childElementCount : -1)) {
                    fliIdx = defaultIdx;
                }
            }
        }
        let cli: Element = cul.children[fliIdx];
        fliIdx = this.isValidLI(cli, fliIdx, e.action);
        cul.children[fliIdx].classList.add(FOCUSED);
        (cul.children[fliIdx] as HTMLElement).focus();
    }

    private isValidLI(cli: Element, index: number, action: string): number {
        let wrapper: Element = this.getWrapper();
        let cul: Element = this.getUlByNavIdx();
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            ((action === DOWNARROW) || (action === RIGHTARROW)) ? index++ : index--;
        }
        cli = cul.children[index];
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            index = this.isValidLI(cli, index, action);
        }
        return index;
    }

    private getUlByNavIdx(navIdxLen: number = this.navIdx.length): HTMLElement {
        if (this.isMenu) {
            let popup: Element = [this.getWrapper()].concat([].slice.call(selectAll('.' + POPUP)))[navIdxLen];
            return isNullOrUndefined(popup) ? null : select('.e-menu-parent', popup) as HTMLElement;
        } else {
            return this.getWrapper().children[navIdxLen] as HTMLElement;
        }
    }

    private rightEnterKeyHandler(e: KeyboardEventArgs): void {
        let eventArgs: MenuEventArgs;
        let cul: Element = this.getUlByNavIdx();
        let fli: Element = this.getLIByClass(cul, FOCUSED);
        if (fli) {
            let fliIdx: number = this.getIdx(cul, fli);
            let navIdx: number[] = this.navIdx.concat(fliIdx);
            let index: number;
            let item: MenuItemModel = this.getItem(navIdx);
            if (item.items.length) {
                this.navIdx.push(fliIdx);
                this.keyType = 'right';
                this.action = e.action;
                this.openMenu(fli, item, null, null, e);
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

    protected closeMenu(ulIndex: number = 0, e: MouseEvent | KeyboardEvent = null): void {
        if (this.isMenuVisible()) {
            let sli: Element;
            let ul: HTMLElement;
            let item: MenuItemModel;
            let items: MenuItemModel[];
            let beforeCloseArgs: BeforeOpenCloseMenuEventArgs;
            let wrapper: Element = this.getWrapper();
            let popups: Element[] = this.getPopups();
            let isClose: boolean = false;
            let cnt: number = this.isMenu ? popups.length + 1 : wrapper.childElementCount;
            ul = this.isMenu && cnt !== 1 ? select('.e-ul', popups[cnt - 2]) as HTMLElement
                : selectAll('.e-menu-parent', wrapper)[cnt - 1] as HTMLElement;
            if (this.isMenu && ul.classList.contains('e-menu')) {
                sli = this.getLIByClass(ul, SELECTED);
                if (sli) {
                    sli.classList.remove(SELECTED);
                }
                isClose = true;
            }
            if (!isClose) {
                item = this.navIdx.length ? this.getItem(this.navIdx) : null;
                items = item ? item.items : this.items as objColl;
                beforeCloseArgs = { element: ul, parentItem: item, items: items, event: e, cancel: false };
                this.trigger('beforeClose', beforeCloseArgs, (observedCloseArgs: BeforeOpenCloseMenuEventArgs) => {
                    let popupEle: HTMLElement; let closeArgs: OpenCloseMenuEventArgs;
                    let popupObj: Popup; let isOpen: boolean = !observedCloseArgs.cancel;
                    if (isOpen || this.isCMenu) {
                        if (this.isMenu) {
                            popupEle = closest(ul, '.' + POPUP) as HTMLElement;
                            if (this.hamburgerMode) {
                                popupEle.parentElement.style.minHeight = '';
                            }
                            this.unWireKeyboardEvent(popupEle);
                            this.destroyScrollObj(
                                getInstance(popupEle.children[0] as HTMLElement, VScroll) as VScroll, popupEle.children[0]);
                            popupObj = getInstance(popupEle, Popup) as Popup;
                            popupObj.hide();
                            popupObj.destroy();
                            detach(popupEle);
                        } else {
                            this.toggleAnimation(ul, false);
                        }
                        closeArgs = { element: ul, parentItem: item, items: items };
                        this.trigger('onClose', closeArgs);
                        this.navIdx.pop();
                    }
                    if (this.isCMenu) {
                        if (this.canOpen(e.target as Element)) {
                            this.openMenu(null, null, this.pageY, this.pageX, e);
                        }
                        this.isCMenu = false;
                    } else if (isOpen && this.hamburgerMode && ulIndex !== null) {
                        this.afterCloseMenu(e as MouseEvent);
                    } else if (isOpen && !ulIndex && this.navIdx.length) {
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
                            let cul: Element = this.getUlByNavIdx();
                            let sli: Element = this.getLIByClass(cul, SELECTED);
                            if (sli) {
                                sli.setAttribute('aria-expanded', 'false');
                                sli.classList.remove(SELECTED);
                                sli.classList.add(FOCUSED);
                                (sli as HTMLElement).focus();
                            }
                        }
                    }
                    this.removeStateWrapper();
                });
            }
        }
    }
    private destroyScrollObj(scrollObj: VScroll | HScroll, scrollEle: Element): void {
        if (scrollObj) {
            scrollObj.destroy();
            scrollEle.parentElement.appendChild(select('.e-menu-parent', scrollEle));
            detach(scrollEle);
        }
    }

    private getPopups(): Element[] {
        let popups: Element[] = [];
        [].slice.call(document.querySelectorAll('.' + POPUP)).forEach((elem: Element) => {
            if (this.getIndex(elem.querySelector('.' + ITEM).id, true).length) {
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
            let filter: string[] = this.filter.split(' ');
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
        let eventArgs: BeforeOpenCloseMenuEventArgs; let wrapper: Element = this.getWrapper();
        this.lItem = li; let elemId: string = this.element.id !== '' ? this.element.id : 'menu';
        this.isMenusClosed = false;
        if (li) {
            this.uList = this.createItems((<obj>item)[this.getField('children', this.navIdx.length - 1)] as objColl);
            if (!this.isMenu && Browser.isDevice) {
                (wrapper.lastChild as HTMLElement).style.display = 'none';
                let data: { [key: string]: string } = {
                    text: (<obj>item)[this.getField('text')].toString(), iconCss: ICONS + ' e-previous'
                };
                let hdata: MenuItem = new MenuItem(this.items[0] as MenuItem, 'items', data, true);
                let hli: Element = this.createItems([hdata] as MenuItemModel[]).children[0];
                hli.classList.add(HEADER);
                this.uList.insertBefore(hli, this.uList.children[0]);
            }
            if (this.isMenu) {
                this.popupWrapper = this.createElement('div', {
                    className: 'e-' + this.getModuleName() + '-wrapper ' + POPUP, id: li.id + '-ej2menu-' + elemId + '-popup' });
                if (this.hamburgerMode) {
                    top = (li as HTMLElement).offsetHeight;
                    li.appendChild(this.popupWrapper);
                } else {
                    document.body.appendChild(this.popupWrapper);
                }
                this.isNestedOrVertical = this.element.classList.contains('e-vertical') || this.navIdx.length !== 1;
                this.popupObj = this.generatePopup(this.popupWrapper, this.uList, li as HTMLElement, this.isNestedOrVertical);
                if (this.hamburgerMode) {
                    this.calculateIndentSize(this.uList, li);
                } else {
                    if (this.cssClass) {
                        addClass([this.popupWrapper], this.cssClass.split(' '));
                    }
                    this.popupObj.hide();
                }
                this.triggerBeforeOpen(li, this.uList, item, e, 0, 0, 'menu');
            } else {
                this.uList.style.zIndex = this.element.style.zIndex; wrapper.appendChild(this.uList);
                this.triggerBeforeOpen(li, this.uList, item, e, top, left, 'none');
            }
        } else {
            this.uList = this.element;
            this.uList.style.zIndex = getZindexPartial(target ? target : this.element).toString();
            this.triggerBeforeOpen(li, this.uList, item, e, top, left, 'none');
        }
        if (this.isMenu && this.template && this.isBlazor()) {
            let menuTemplateId: string = this.element.id + TEMPLATE_PROPERTY;
            if (Object.keys(blazorTemplates).length) {
                let itemFromBlazorTemplate: objColl = (<obj>blazorTemplates)[menuTemplateId] as objColl;
                this.tempItem = this.tempItem.concat(itemFromBlazorTemplate);
                (<{ [key: string]: Object }>blazorTemplates)[menuTemplateId] = this.tempItem;
            }
            updateBlazorTemplate(menuTemplateId, TEMPLATE_PROPERTY, this);
        }
    }

    private calculateIndentSize(ul: HTMLElement, li: Element): void {
        let liStyle: CSSStyleDeclaration = getComputedStyle(li);
        let liIndent: number = parseInt(liStyle.textIndent, 10);
        if (this.navIdx.length < 2 && !li.classList.contains('e-blankicon')) {
            liIndent *= 2;
        } else {
            liIndent += (liIndent / 4);
        }
        ul.style.textIndent = liIndent + 'px';
        let blankIconElem: NodeList = ul.querySelectorAll('.e-blankicon');
        if (blankIconElem && blankIconElem.length) {
            let menuIconElem: HTMLElement = ul.querySelector('.e-menu-icon');
            let menuIconElemStyle: CSSStyleDeclaration = getComputedStyle(menuIconElem);
            let blankIconIndent: number = (parseInt(menuIconElemStyle.marginRight, 10) + menuIconElem.offsetWidth + liIndent);
            blankIconElem.forEach((element: HTMLElement) => element.style.textIndent = blankIconIndent + 'px');
        }
    }

    private generatePopup(
        popupWrapper: HTMLElement, ul: HTMLElement, li: HTMLElement, isNestedOrVertical: boolean): Popup {
        let popupObj: Popup = new Popup(popupWrapper, {
            actionOnScroll: this.hamburgerMode ? 'none' : 'reposition',
            relateTo: li,
            collision: this.hamburgerMode ? { X: 'none', Y: 'none' } : { X: isNestedOrVertical ||
                this.enableRtl ? 'none' : 'flip', Y: 'fit' },
            position: (isNestedOrVertical && !this.hamburgerMode) ? { X: 'right', Y: 'top' } : { X: 'left', Y: 'bottom' },
            targetType: 'relative',
            enableRtl: this.enableRtl,
            content: ul,
            open: (): void => {
                    let scrollEle: HTMLElement = select('.e-menu-vscroll', popupObj.element) as HTMLElement;
                    if (scrollEle) {
                        scrollEle.style.height = 'inherit';
                        scrollEle.style.maxHeight = '';
                    }
                    let ul: HTMLElement = select('.e-ul', popupObj.element) as HTMLElement;
                    popupObj.element.style.maxHeight = '';
                    ul.focus();
                    this.triggerOpen(ul);
                }
        });
        return popupObj;
    }

    protected createHeaderContainer(wrapper?: Element): void {
        wrapper = wrapper || this.getWrapper();
        let spanElem: HTMLElement = this.createElement('span', { className: 'e-' + this.getModuleName() + '-header' });
        let spanTitle: HTMLElement = this.createElement('span', {
            className: 'e-' + this.getModuleName() + '-title', innerHTML: this.title });
        let spanIcon: HTMLElement = this.createElement('span', {
            className: 'e-icons e-' + this.getModuleName() + '-icon', attrs: { 'tabindex': '0' } });
        spanElem.appendChild(spanTitle);
        spanElem.appendChild(spanIcon);
        wrapper.insertBefore(spanElem, this.element);
    }

    protected openHamburgerMenu(e?: MouseEvent | KeyboardEvent) : void {
        if (this.hamburgerMode) {
            let eventArgs: BeforeOpenCloseMenuEventArgs;
            this.triggerBeforeOpen(null, this.element, null, e, 0, 0, 'hamburger');
        }
    }

    protected closeHamburgerMenu(e?: MouseEvent | KeyboardEvent) : void {
        if (this.hamburgerMode) {
            let beforeCloseArgs: BeforeOpenCloseMenuEventArgs;
            beforeCloseArgs = { element: this.element, parentItem: null, event: e, items: this.items, cancel: false };
            this.trigger('beforeClose', beforeCloseArgs, (observedHamburgerCloseArgs: BeforeOpenCloseMenuEventArgs) => {
                if (!observedHamburgerCloseArgs.cancel) {
                    this.closeMenu(null, e);
                    this.element.classList.add('e-hide-menu');
                    this.trigger('onClose', { element: this.element, parentItem: null, items: this.items });
                }
            });
        }
    }

    private callFit(element: HTMLElement, x: boolean, y: boolean, top: number, left: number): OffsetPosition {
        return fit(element, null, { X: x, Y: y }, { top: top, left: left });
    }

    private triggerBeforeOpen(
        li: Element, ul: HTMLElement, item: MenuItemModel, e: MouseEvent | KeyboardEvent,
        top: number, left: number, type: string): void {
        let navIdx: number[] = this.getIndex(li ? li.id : null, true);
        let items: MenuItemModel[] = li ? (<obj>item)[this.getField('children', this.navIdx.length - 1)] as objColl : this.items as objColl;
        let eventArgs: BeforeOpenCloseMenuEventArgs = {
            element: ul, items: items, parentItem: item, event: e, cancel: false, top: top, left: left
        };
        let menuType: string = type;
        this.trigger('beforeOpen', eventArgs, (observedOpenArgs: BeforeOpenCloseMenuEventArgs) => {
            switch (menuType) {
                case 'menu':
                    if (!this.hamburgerMode) {
                        this.top = observedOpenArgs.top; this.left = observedOpenArgs.left;
                    }
                    this.popupWrapper.style.display = 'block';
                    if (!this.hamburgerMode) {
                        this.popupWrapper.style.maxHeight = this.popupWrapper.getBoundingClientRect().height + 'px';
                        this.addScrolling(
                            this.popupWrapper, this.uList, 'vscroll', this.popupWrapper.offsetHeight, this.uList.offsetHeight);
                        this.checkScrollOffset(e);
                    }
                    let collide: string[];
                    if (!this.hamburgerMode && !this.left && !this.top) {
                        this.popupObj.refreshPosition(this.lItem as HTMLElement, true);
                        this.left = parseInt(this.popupWrapper.style.left, 10); this.top = parseInt(this.popupWrapper.style.top, 10);
                        if (this.enableRtl) {
                            this.left =
                            this.isNestedOrVertical ? this.left - this.popupWrapper.offsetWidth - this.lItem.parentElement.offsetWidth
                                : this.left - this.popupWrapper.offsetWidth + (this.lItem as HTMLElement).offsetWidth;
                        }
                        collide = isCollide(this.popupWrapper, null, this.left, this.top);
                        if ((this.isNestedOrVertical || this.enableRtl) && (collide.indexOf('right') > -1
                        || collide.indexOf('left') > -1)) {
                            this.popupObj.collision.X = 'none';
                            let offWidth: number =
                            (closest(this.lItem, '.e-' + this.getModuleName() + '-wrapper') as HTMLElement).offsetWidth;
                            this.left =
                            this.enableRtl ? calculatePosition(this.lItem, this.isNestedOrVertical ? 'right' : 'left', 'top').left
                            : this.left - this.popupWrapper.offsetWidth - offWidth;
                        }
                        collide = isCollide(this.popupWrapper, null, this.left, this.top);
                        if (collide.indexOf('left') > -1 || collide.indexOf('right') > -1) {
                            this.left = this.callFit(this.popupWrapper, true, false, this.top, this.left).left;
                        }
                        this.popupWrapper.style.left = this.left + 'px';
                    } else {
                        this.popupObj.collision = { X: 'none', Y: 'none' };
                    }
                    this.popupWrapper.style.display = '';
                    break;
                case 'none':
                    this.top = observedOpenArgs.top; this.left = observedOpenArgs.left;
                    break;
                case 'hamburger':
                    if (!observedOpenArgs.cancel) {
                        this.element.classList.remove('e-hide-menu');
                        this.triggerOpen(this.element);
                    }
                    break;
            }
            if (menuType !== 'hamburger') {
                if (observedOpenArgs.cancel) {
                    if (this.isMenu) { this.popupObj.destroy(); detach(this.popupWrapper); }
                    this.navIdx.pop();
                } else {
                    if (this.isMenu) {
                        if (this.hamburgerMode) {
                            this.popupWrapper.style.top = this.top + 'px'; this.popupWrapper.style.left = 0 + 'px';
                            this.toggleAnimation(this.popupWrapper);
                        } else {
                            this.wireKeyboardEvent(this.popupWrapper);
                            rippleEffect(this.popupWrapper, { selector: '.' + ITEM });
                            this.popupWrapper.style.left = this.left + 'px'; this.popupWrapper.style.top = this.top + 'px';
                            let animationOptions: AnimationModel = this.animationSettings.effect !== 'None' ? {
                                name: this.animationSettings.effect, duration: this.animationSettings.duration,
                                timingFunction: this.animationSettings.easing
                            } : null;
                            this.popupObj.show(animationOptions, this.lItem as HTMLElement);
                        }
                    } else {
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
                    let eventArgs: MenuEventArgs = { element: li as HTMLElement, item: item, event: e };
                    this.trigger('select', eventArgs);
                }
                (li as HTMLElement).focus(); cul = this.getUlByNavIdx();
                let index: number = this.isValidLI(cul.children[0], 0, this.action);
                cul.children[index].classList.add(FOCUSED);
                (cul.children[index] as HTMLElement).focus();
            }
        });
    }

    private checkScrollOffset(e: MouseEvent | KeyboardEvent): void {
        let wrapper: Element = this.getWrapper();
        if (wrapper.children[0].classList.contains('e-menu-hscroll') && this.navIdx.length === 1) {
            let trgt: HTMLElement = isNullOrUndefined(e) ? this.element : closest(e.target as Element, '.' + ITEM) as HTMLElement;
            let offsetEle: HTMLElement = (select('.e-hscroll-bar', wrapper) as HTMLElement);
            let offsetLeft: number; let offsetRight: number;
            if (offsetEle.scrollLeft > trgt.offsetLeft) {
                offsetEle.scrollLeft -= (offsetEle.scrollLeft - trgt.offsetLeft);
            }
            offsetLeft = offsetEle.scrollLeft + offsetEle.offsetWidth;
            offsetRight = trgt.offsetLeft + trgt.offsetWidth;
            if (offsetLeft < offsetRight) {
                offsetEle.scrollLeft += (offsetRight - offsetLeft);
            }
        }
    }

    private addScrolling(wrapper: HTMLElement, ul: HTMLElement, scrollType: string, wrapperOffset: number, contentOffset: number): void {
        if (this.enableScrolling && wrapperOffset < contentOffset) {
            let scrollEle: HTMLElement = this.createElement('div', { className: 'e-menu-' + scrollType });
            wrapper.appendChild(scrollEle);
            scrollEle.appendChild(ul);
            scrollEle.style.maxHeight = wrapper.style.maxHeight;
            let scrollObj: VScroll | HScroll;
            wrapper.style.overflow = 'hidden';
            if (scrollType === 'vscroll') {
                scrollObj = new VScroll({ enableRtl: this.enableRtl }, scrollEle);
                scrollObj.scrollStep = (select('.e-' + scrollType + '-bar', wrapper) as HTMLElement).offsetHeight / 2;
            } else {
                scrollObj = new HScroll({ enableRtl: this.enableRtl }, scrollEle);
                scrollObj.scrollStep = (select('.e-' + scrollType + '-bar', wrapper) as HTMLElement).offsetWidth;
            }
        }
    }

    private setPosition(li: Element, ul: HTMLElement, top: number, left: number): void {
        let px: string = 'px';
        this.toggleVisiblity(ul);
        if (ul === this.element || (!isNullOrUndefined(left) && !isNullOrUndefined(top))) {
            let collide: string[] = isCollide(ul, null, left, top);
            if (collide.indexOf('right') > -1) {
                left = left - ul.offsetWidth;
            }
            if (collide.indexOf('bottom') > -1) {
                let offset: OffsetPosition = this.callFit(ul, false, true, top, left);
                top = offset.top - 20;
            }
            collide = isCollide(ul, null, left, top);
            if (collide.indexOf('left') > -1) {
                let offset: OffsetPosition = this.callFit(ul, true, false, top, left);
                left = offset.left;
            }
        } else {
            if (Browser.isDevice) {
                top = Number(this.element.style.top.replace(px, ''));
                left = Number(this.element.style.left.replace(px, ''));
            } else {
                let x: string = this.enableRtl ? 'left' : 'right';
                let offset: OffsetPosition = calculatePosition(li, x, 'top');
                top = offset.top;
                left = offset.left;
                let collide: string[] = isCollide(ul, null, this.enableRtl ? left - ul.offsetWidth : left, top);
                let xCollision: boolean = collide.indexOf('left') > -1 || collide.indexOf('right') > -1;
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
        let level: number = this.navIdx ? this.navIdx.length : 0;
        let showIcon: boolean = this.hasField(items, this.getField('iconCss', level));
        let id: string = 'id'; let iconCss: string = 'iconCss';
        let listBaseOptions: ListBaseOptions = {
            showIcon: showIcon,
            moduleName: 'menu',
            fields: this.getFields(level),
            template: this.template,
            itemCreating: (args: { curData: obj, fields: obj }): void => {
                if (!args.curData[(<obj>args.fields)[id] as string]) {
                    args.curData[(<obj>args.fields)[id] as string] = getUniqueID('menuitem');
                }
                args.curData.htmlAttributes = {
                    role: 'menuitem',
                    tabindex: '-1'
                };
                if (this.isMenu && !(<obj>args.curData)[this.getField('separator', level)]) {
                    (<obj>args.curData.htmlAttributes)['aria-label'] = (<obj>args.curData)[args.fields.text as string];
                }
                if (args.curData[(<obj>args.fields)[iconCss] as string] === '') {
                    args.curData[(<obj>args.fields)[iconCss] as string] = null;
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
                    let span: Element = this.createElement('span', { className: ICONS + ' ' + CARET });
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
                }
                let eventArgs: MenuEventArgs = { item: args.curData, element: args.item as HTMLElement };
                this.trigger('beforeItemRender', eventArgs);
            }
        };
        this.setProperties({'items': this.items}, true);
        if (this.isMenu) {
            listBaseOptions.templateID = this.element.id + TEMPLATE_PROPERTY;
        }

        let ul: HTMLElement = ListBase.createList(
            this.createElement, items as objColl, listBaseOptions, !this.template);
        ul.setAttribute('tabindex', '0');
        if (this.isMenu) {
            ul.setAttribute('role', 'menu');
        }
        return ul;
    }

    private moverHandler(e: MouseEvent): void {
        let trgt: Element = e.target as Element;
        this.liTrgt = trgt;
        let cli: Element = this.getLI(trgt);
        let wrapper: Element = cli ? closest(cli, '.e-' + this.getModuleName() + '-wrapper') : this.getWrapper();
        let hdrWrapper: Element = this.getWrapper(); let regex: RegExp = new RegExp('-ej2menu-(.*)-popup'); let ulId: string;
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
        } else if (this.isMenu && this.showItemOnClick) {
            this.removeLIStateByClass([FOCUSED], [wrapper].concat(this.getPopups()));
        }
        if (this.isMenu) {
            if (!this.showItemOnClick && (trgt.parentElement !== wrapper && !closest(trgt, '.e-' + this.getModuleName() + '-popup'))
                && (!cli || (cli && !this.getIndex(cli.id, true).length))) {
                this.removeLIStateByClass([FOCUSED, SELECTED], [wrapper]);
                if (this.navIdx.length) {
                    this.isClosed = true;
                    this.closeMenu(null, e);
                }
            } else if (isDifferentElem) {
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
            let wrapper: Element = closest(this.liTrgt, '.e-menu-vscroll');
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
        let fieldName: object = (<obj>this.fields)[propName];
        return typeof fieldName === 'string' ? fieldName :
            (!(<obj>fieldName)[level] ? (fieldName as obj)[(<objColl>fieldName).length - 1].toString()
                : (<obj>fieldName)[level].toString());
    }

    private getFields(level: number = 0): obj {
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
        this.element.classList.contains('e-hide-menu') ? this.openHamburgerMenu(e) : this.closeHamburgerMenu(e);
    }

    private clickHandler(e: MouseEvent): void {
        if (this.isTapHold) {
            this.isTapHold = false;
        } else {
            let wrapper: Element = this.getWrapper();
            let trgt: Element = e.target as Element;
            let cli: Element = this.cli = this.getLI(trgt);
            let cliWrapper: Element = cli ? closest(cli, '.e-' + this.getModuleName() + '-wrapper') : null;
            let isInstLI: boolean = cli && cliWrapper && (this.isMenu ? this.getIndex(cli.id, true).length > 0
                : wrapper.firstElementChild.id === cliWrapper.firstElementChild.id);
            if (isInstLI && e.type === 'click' && !cli.classList.contains(HEADER)) {
                this.setLISelected(cli);
                let navIdx: number[] = this.getIndex(cli.id, true);
                let item: MenuItemModel = this.getItem(navIdx);
                let eventArgs: MenuEventArgs = { element: cli as HTMLElement, item: item, event: e };
                this.trigger('select', eventArgs);
            }
            if (isInstLI && (e.type === 'mouseover' || Browser.isDevice || this.showItemOnClick)) {
                let ul: HTMLElement;
                if (cli.classList.contains(HEADER)) {
                    ul = wrapper.children[this.navIdx.length - 1] as HTMLElement;
                    this.toggleAnimation(ul);
                    let sli: Element = this.getLIByClass(ul, SELECTED);
                    if (sli) {
                        sli.classList.remove(SELECTED);
                    }
                    detach(cli.parentNode);
                    this.navIdx.pop();
                } else {
                    if (!cli.classList.contains(SEPARATOR)) {
                        this.showSubMenu = true;
                        let cul: Element = cli.parentNode as Element;
                        this.cliIdx = this.getIdx(cul, cli);
                        if (this.isMenu || !Browser.isDevice) {
                            let culIdx: number = this.isMenu ? Array.prototype.indexOf.call(
                                [wrapper].concat(this.getPopups()), closest(cul, '.' + 'e-' + this.getModuleName() + '-wrapper'))
                                : this.getIdx(wrapper, cul);
                            if (this.navIdx[culIdx] === this.cliIdx) {
                                this.showSubMenu = false;
                            }
                            if (culIdx !== this.navIdx.length && (e.type !== 'mouseover' || this.showSubMenu)) {
                                let sli: Element = this.getLIByClass(cul, SELECTED);
                                if (sli) {
                                    sli.classList.remove(SELECTED);
                                }
                                this.isClosed = true;
                                this.keyType = 'click';
                                this.closeMenu(culIdx + 1, e);
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
                    let popupEle: Element = closest(trgt, '.' + POPUP);
                    let cIdx: number = Array.prototype.indexOf.call(this.getPopups(), popupEle) + 1;
                    if (cIdx < this.navIdx.length) {
                        this.closeMenu(cIdx + 1, e);
                        this.removeLIStateByClass([FOCUSED, SELECTED], [popupEle]);
                    }
                } else if (this.isMenu && this.hamburgerMode && trgt.tagName === 'SPAN'
                    && trgt.classList.contains('e-menu-icon')) {
                    this.menuHeaderClickHandler(e);
                } else {
                    if (trgt.tagName !== 'UL' || trgt.parentElement !== wrapper) {
                        if (!cli || !cli.querySelector('.' + CARET)) {
                            this.closeMenu(null, e);
                        }
                    }
                }
            }
        }
    }
    private afterCloseMenu(e: MouseEvent): void {
        if (this.showSubMenu) {
            let idx: number[] = this.navIdx.concat(this.cliIdx);
            let item: MenuItemModel = this.getItem(idx);
            if ((<objColl>(<obj>item)[this.getField('children', idx.length - 1)]) &&
                (<objColl>(<obj>item)[this.getField('children', idx.length - 1)]).length) {
                if (e.type === 'mouseover' || (Browser.isDevice && this.isMenu)) {
                    this.setLISelected(this.cli);
                }
                this.cli.setAttribute('aria-expanded', 'true');
                this.navIdx.push(this.cliIdx);
                this.openMenu(this.cli, item, null, null, e);
            } else {
                if (e.type !== 'mouseover') {
                    this.closeMenu(null, e);
                }
            }
        }
        this.keyType = '';
    }
    private setLISelected(li: Element): void {
        let sli: Element = this.getLIByClass(li.parentElement, SELECTED);
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

    private getItem(navIdx: number[]): MenuItemModel {
        navIdx = navIdx.slice();
        let idx: number = navIdx.pop();
        let items: MenuItemModel[] = this.getItems(navIdx);
        return items[idx];
    }

    private getItems(navIdx: number[]): objColl {
        let items: objColl = this.items as objColl;
        for (let i: number = 0; i < navIdx.length; i++) {
            items = (<obj>items[navIdx[i]])[this.getField('children', i)] as objColl;
        }
        return items;
    }

    private getIdx(ul: Element, li: Element, skipHdr: boolean = true): number {
        let idx: number = Array.prototype.indexOf.call(ul.querySelectorAll('li'), li);
        if (this.isMenu && this.template && this.isBlazor()) {
            idx = Array.prototype.indexOf.call(ul.querySelectorAll(li.tagName), li);
        } else {
            idx = Array.prototype.indexOf.call(ul.children, li);
        }
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

    private isBlazor(): boolean {
        return ((Object.keys(window).indexOf('ejsInterop') === -1) ? false : true);
    }

    private removeChildElement(elem: HTMLUListElement): HTMLUListElement {
        while (elem.firstElementChild) {
            elem.removeChild(elem.firstElementChild);
          }
        return elem;
    }
    /**
     * Called internally if any of the property value changed
     * @private
     * @param {MenuBaseModel} newProp
     * @param {MenuBaseModel} oldProp
     * @returns void
     */
    public onPropertyChanged(newProp: MenuBaseModel, oldProp: MenuBaseModel): void {
        let wrapper: HTMLElement = this.getWrapper() as HTMLElement;
        for (let prop of Object.keys(newProp)) {
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
                        this.element.classList.contains('e-vertical') ?
                            this.addScrolling(wrapper, this.element, 'vscroll', wrapper.offsetHeight, this.element.offsetHeight)
                            : this.addScrolling(wrapper, this.element, 'hscroll', wrapper.offsetWidth, this.element.offsetWidth);
                        (this.getPopups() as HTMLElement[]).forEach((wrapper: HTMLElement) => {
                            ul = select('.e-ul', wrapper) as HTMLElement;
                            this.addScrolling(wrapper, ul, 'vscroll', wrapper.offsetHeight, ul.offsetHeight);
                        });
                    } else {
                        let ul: HTMLElement = wrapper.children[0] as HTMLElement;
                        this.element.classList.contains('e-vertical') ? this.destroyScrollObj(getInstance(ul, VScroll) as VScroll, ul)
                            : this.destroyScrollObj(getInstance(ul, HScroll) as HScroll, ul);
                        wrapper.style.overflow = '';
                        wrapper.appendChild(this.element);
                        (this.getPopups() as HTMLElement[]).forEach((wrapper: HTMLElement) => {
                            ul = wrapper.children[0] as HTMLElement;
                            this.destroyScrollObj(getInstance(ul, VScroll) as VScroll, ul);
                            wrapper.style.overflow = '';
                        });
                    }
                    break;
                case 'items':
                    let idx: number;
                    let navIdx: number[];
                    let item: MenuItemModel[];
                    if (!Object.keys(oldProp.items).length) {
                        let ul: HTMLElement = this.element;
                        if (this.isBlazor()) {
                            ul = this.removeChildElement(this.element);
                        } else {
                            ul.innerHTML = '';
                        }
                        let lis: HTMLElement[] = [].slice.call(this.createItems(this.items).children);
                        lis.forEach((li: HTMLElement): void => {
                            ul.appendChild(li);
                        });
                        for (let i: number = 1, count: number = wrapper.childElementCount; i < count; i++) {
                            detach(wrapper.lastElementChild);
                        }
                        this.navIdx = [];
                    } else {
                        let keys: string[] = Object.keys(newProp.items);
                        for (let i: number = 0; i < keys.length; i++) {
                            navIdx = this.getChangedItemIndex(newProp, [], Number(keys[i]));
                            if (navIdx.length <= this.getWrapper().children.length) {
                                idx = navIdx.pop();
                                item = this.getItems(navIdx);
                                this.insertAfter([item[idx]], item[idx].text);
                                this.removeItem(item, navIdx, idx);
                            }
                            navIdx.length = 0;
                        }
                    }
                    break;
            }
        }
    }

    private getChangedItemIndex(newProp: MenuBaseModel, index: number[], idx: number): number[] {
        index.push(idx);
        let key: string = Object.keys((<objColl>newProp.items)[idx]).pop();
        if (key === 'items') {
            let item: MenuItemModel = (<objColl>newProp.items)[idx];
            this.getChangedItemIndex(item, index, Number(Object.keys(item.items).pop()));
        } else {
            if (key === 'isParentArray' && index.length > 1) {
                index.pop();
            }
        }
        return index;
    }

    private removeItem(item: MenuItemModel[], navIdx: number[], idx: number): void {
        item.splice(idx, 1);
        let uls: HTMLCollection = this.getWrapper().children;
        if (navIdx.length < uls.length) {
            detach(uls[navIdx.length].children[idx]);
        }
    }

    /**
     * Used to unwire the bind events.
     * @private
     */
    protected unWireEvents(targetSelctor: string = this.target): void {
        let wrapper: HTMLElement = this.getWrapper() as HTMLElement;
        if (targetSelctor) {
            let target: HTMLElement;
            let touchModule: Touch;
            let targetElems: HTMLElement[] = selectAll(targetSelctor);
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
                for (let parent of getScrollableParent(this.targetElement)) {
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
        let keyboardModule: KeyboardEvents = getInstance(element, KeyboardEvents) as KeyboardEvents;
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
        let item: MenuItemModel = this.navIdx.length ? this.getItem(this.navIdx) : null;
        let eventArgs: OpenCloseMenuEventArgs = {
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
                let ele: HTMLElement;
                ele = this.getWrapper().children[this.getIdx(this.getWrapper(), ul) - 1] as HTMLElement;
                if (ele) {
                    (ele.querySelector('.' + SELECTED) as HTMLElement).focus();
                } else {
                    this.element.focus();
                }
            }
        } else {
            if (ul === this.element) {
                let fli: Element = this.getLIByClass(this.element, FOCUSED);
                if (fli) {
                    fli.classList.remove(FOCUSED);
                }
                let sli: Element = this.getLIByClass(this.element, SELECTED);
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
     * @returns string
     */
    protected getPersistData(): string {
        return '';
    }

    /**
     * Get wrapper element.
     * @returns Element
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
     * @param items Text items that needs to be enabled/disabled.
     * @param enable Set `true`/`false` to enable/disable the list items.
     * @param isUniqueId - Set `true` if it is a unique id. 
     * @returns void
     */
    public enableItems(items: string[], enable: boolean = true, isUniqueId?: boolean): void {
        let ul: Element;
        let idx: number;
        let navIdx: number[];
        let disabled: string = DISABLED;
        for (let i: number = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i], isUniqueId);
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
     * @param items Text items that needs to be shown.
     * @param isUniqueId - Set `true` if it is a unique id.
     * @returns void
     */
    public showItems(items: string[], isUniqueId?: boolean): void {
        this.showHideItems(items, false, isUniqueId);
    }

    /**
     * This method is used to hide the menu items in the Menu based on the items text.
     * @param items Text items that needs to be hidden.
     * @returns void
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
     * @param items Text items that needs to be removed.
     * @returns void
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
     * @param items Items that needs to be inserted.
     * @param text Text item after that the element to be inserted.
     * @returns void
     */
    public insertAfter(items: MenuItemModel[], text: string, isUniqueId?: boolean): void {
        this.insertItems(items, text, isUniqueId);
    }

    /**
     * It is used to insert the menu items before the specified menu item text.
     * @param items Items that needs to be inserted.
     * @param text Text item before that the element to be inserted.
     * @param isUniqueId - Set `true` if it is a unique id.
     * @returns void
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
        let showIcon: boolean;
        for (let i: number = 0; i < items.length; i++) {
            navIdx = this.getIndex(text, isUniqueId);
            idx = navIdx.pop();
            iitems = this.getItems(navIdx);
            menuitem = new MenuItem(iitems[0] as MenuItem, 'items', items[i], true);
            iitems.splice(isAfter ? idx + 1 : idx, 0, menuitem);
            let uls: Element[] = this.isMenu ? [this.getWrapper()].concat(this.getPopups()) : [].slice.call(this.getWrapper().children);
            if (navIdx.length < uls.length) {
                idx = isAfter ? idx + 1 : idx;
                showIcon = this.hasField(iitems, this.getField('iconCss', navIdx.length - 1));
                li = this.createItems(iitems).children[idx];
                let ul: Element = this.isMenu ? select('.e-menu-parent', uls[navIdx.length]) : uls[navIdx.length];
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
     * @returns void
     */

    public destroy(): void {
        let wrapper: Element = this.getWrapper();
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
                        let refEle: Element = this.clonedElement.nextElementSibling;
                        refEle && refEle !== wrapper ? this.clonedElement.parentElement.insertBefore(this.element, refEle) :
                        this.clonedElement.parentElement.appendChild(this.element);
                        if (this.isBlazor()) {
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
                if (this.isBlazor()) {
                    this.element = this.removeChildElement(this.element);
                } else {
                    this.element.innerHTML = '';
                }
                this.removeAttributes();
                wrapper.parentNode.insertBefore(this.element, wrapper);
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
        }
    }
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
}

/**
 * Interface for open/close event.
 */
export interface OpenCloseMenuEventArgs extends BaseEventArgs {
    element: HTMLElement;
    items: MenuItemModel[] | { [key: string]: Object }[];
    parentItem: MenuItemModel;
}
