import { Component, Property, ChildProperty, NotifyPropertyChanges, INotifyPropertyChanged, AnimationModel } from '@syncfusion/ej2-base';
import { Event, EventHandler, EmitType, BaseEventArgs, KeyboardEvents, KeyboardEventArgs, Touch, TapEventArgs } from '@syncfusion/ej2-base';
import { attributes, Animation, AnimationOptions, TouchEventArgs, MouseEventArgs } from '@syncfusion/ej2-base';
import { Browser, Collection, setValue, getValue, getUniqueID, getInstance, isNullOrUndefined } from '@syncfusion/ej2-base';
import { select, selectAll, closest, detach, append, rippleEffect, isVisible, Complex, addClass, removeClass } from '@syncfusion/ej2-base';
import { ListBase, ListBaseOptions } from '@syncfusion/ej2-lists';
import { getZindexPartial, calculatePosition, OffsetPosition, isCollide, flip, fit, Popup } from '@syncfusion/ej2-popups';
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
    private ngElement: HTMLElement;
    private targetElement: HTMLElement;
    private delegateClickHandler: Function;
    private delegateMoverHandler: Function;
    private delegateMouseDownHandler: Function;
    private navIdx: number[] = [];
    private animation: Animation = new Animation({});
    private isTapHold: boolean = false;
    protected isMenu: boolean;
    private rippleFn: Function;

    /**
     * Triggers while rendering each menu item.
     * @event
     */
    @Event()
    public beforeItemRender: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the menu item.
     * @event
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while opening the menu item.
     * @event
     */
    @Event()
    public onOpen: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the menu.
     * @event
     */
    @Event()
    public beforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while closing the menu.
     * @event
     */
    @Event()
    public onClose: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting menu item.
     * @event
     */
    @Event()
    public select: EmitType<MenuEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event
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
     * Not applicable to Menu component.
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
        if (this.element.tagName === 'EJS-CONTEXTMENU') {
            this.element.style.display = 'none';
            this.element.classList.remove('e-' + this.getModuleName());
            this.element.classList.remove('e-control');
            let ejInst: Object = getValue('ej2_instances', this.element);
            let ul: Element = this.createElement('ul');
            this.ngElement = this.element;
            this.element = ul as HTMLUListElement;
            this.element.classList.add('e-control');
            this.element.classList.add('e-' + this.getModuleName());
            setValue('ej2_instances', ejInst, this.element);
            if (!this.element.id) {
                this.element.id = getUniqueID(this.getModuleName());
            }
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
            this.ngElement = wrapper;
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
        this.wireEvents();
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
    }

    private renderItems(): void {
        if (!(this.items as objColl).length) {
            let items: { [key: string]: Object; }[] = ListBase.createJsonFromElement(this.element, { fields: { child: 'items' } });
            this.setProperties({ items: items }, true);
            this.element.innerHTML = '';
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
                if (Browser.isIos) {
                    new Touch(target, { tapHold: this.touchHandler.bind(this) });
                } else {
                    EventHandler.add(target, 'contextmenu', this.cmenuHandler, this);
                }
            }
            this.targetElement = target;
            for (let parent of getScrollableParent(this.targetElement)) {
                EventHandler.add(parent, 'scroll', this.scrollHandler, this);
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
            && !closest(e.target as Element, '.e-' + this.getModuleName() + '-popup')) {
            this.closeMenu(this.navIdx.length, e);
        }
    }

    private keyBoardHandler(e: KeyboardEventArgs): void {
        let actionName: string = '';
        let trgt: Element = e.target as Element;
        let actionNeeded: boolean = this.isMenu && !this.element.classList.contains('e-vertical') && this.navIdx.length < 1;
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
                this.rightEnterKeyHandler(e);
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
                this.openMenu(fli, item, null, null, e);
                fli.classList.remove(FOCUSED);
                if (this.isMenu && this.navIdx.length === 1) {
                    this.removeLIStateByClass([SELECTED], [this.getWrapper()]);
                }
                fli.classList.add(SELECTED);
                if (e.action === ENTER) {
                    eventArgs = { element: fli as HTMLElement, item: item };
                    this.trigger('select', eventArgs);
                }
                (fli as HTMLElement).focus();
                cul = this.getUlByNavIdx();
                index = this.isValidLI(cul.children[0], 0, e.action);
                cul.children[index].classList.add(FOCUSED);
                (cul.children[index] as HTMLElement).focus();
            } else {
                if (e.action === ENTER) {
                    if (this.isMenu && this.navIdx.length === 0) {
                        this.removeLIStateByClass([SELECTED], [this.getWrapper()]);
                    } else {
                        fli.classList.remove(FOCUSED);
                    }
                    fli.classList.add(SELECTED);
                    eventArgs = { element: fli as HTMLElement, item: item };
                    this.trigger('select', eventArgs);
                    this.closeMenu(null, e);
                }
            }
        }
    }

    private leftEscKeyHandler(e: KeyboardEventArgs): void {
        if (this.navIdx.length) {
            this.closeMenu(this.navIdx.length, e);
            let cul: Element = this.getUlByNavIdx();
            let sli: Element = this.getLIByClass(cul, SELECTED);
            if (sli) {
                sli.setAttribute('aria-expanded', 'false');
                sli.classList.remove(SELECTED);
                sli.classList.add(FOCUSED);
                (sli as HTMLElement).focus();
            }
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
        this.closeMenu(null, e);
        if (this.canOpen(e.target as Element)) {
            if (e.changedTouches) {
                this.openMenu(null, null, e.changedTouches[0].pageY + 1, e.changedTouches[0].pageX + 1, e);
            } else {
                this.openMenu(null, null, e.pageY + 1, e.pageX + 1, e);
            }
        }
    }

    protected closeMenu(ulIndex: number = 0, e: MouseEvent | KeyboardEvent = null): void {
        if (this.isMenuVisible()) {
            let ul: HTMLElement;
            let sli: Element;
            let item: MenuItemModel;
            let items: MenuItemModel[];
            let closeArgs: OpenCloseMenuEventArgs;
            let beforeCloseArgs: BeforeOpenCloseMenuEventArgs;
            let popupEle: HTMLElement;
            let popupObj: Popup;
            let wrapper: Element = this.getWrapper();
            let popups: Element[] = this.getPopups();
            for (let cnt: number = this.isMenu ? popups.length + 1 : wrapper.childElementCount; cnt > ulIndex; cnt--) {
                ul = this.isMenu && cnt !== 1 ? select('.e-ul', popups[cnt - 2]) as HTMLElement
                    : selectAll('.e-menu-parent', wrapper)[cnt - 1] as HTMLElement;
                if (this.isMenu && ul.classList.contains('e-menu')) {
                    sli = this.getLIByClass(ul, SELECTED);
                    if (sli) {
                        sli.classList.remove(SELECTED);
                    }
                    break;
                }
                item = this.navIdx.length ? this.getItem(this.navIdx) : null;
                items = item ? item.items : this.items as objColl;
                beforeCloseArgs = { element: ul, parentItem: item, items: items, event: e, cancel: false };
                this.trigger('beforeClose', beforeCloseArgs);
                if (!beforeCloseArgs.cancel) {
                    if (this.isMenu) {
                        popupEle = closest(ul, '.' + POPUP) as HTMLElement;
                        this.unWireKeyboardEvent(popupEle);
                        this.destroyScrollObj(getInstance(popupEle.children[0] as HTMLElement, VScroll) as VScroll, popupEle.children[0]);
                        popupObj = getInstance(popupEle, Popup) as Popup;
                        popupObj.hide();
                        popupObj.destroy();
                        detach(popupEle);
                    } else {
                        this.toggleAnimation(ul, false);
                    }
                    this.navIdx.length = ulIndex ? ulIndex - 1 : ulIndex;
                    closeArgs = { element: ul, parentItem: item, items: items };
                    this.trigger('onClose', closeArgs);
                }
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
        let ele: NodeListOf<Element> = document.querySelectorAll('.' + POPUP);
        ele.forEach((elem: Element) => {
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
        let ul: HTMLElement; let popupObj: Popup; let popupWrapper: HTMLElement; let eventArgs: BeforeOpenCloseMenuEventArgs;
        let wrapper: Element = this.getWrapper();
        if (li) {
            ul = this.createItems((<obj>item)[this.getField('children', this.navIdx.length - 1)] as objColl);
            if (!this.isMenu && Browser.isDevice) {
                (wrapper.lastChild as HTMLElement).style.display = 'none';
                let data: { [key: string]: string } = {
                    text: (<obj>item)[this.getField('text')].toString(), iconCss: ICONS + ' e-previous'
                };
                let hdata: MenuItem = new MenuItem(this.items[0] as MenuItem, null, data, true);
                let hli: Element = this.createItems([hdata] as MenuItemModel[]).children[0];
                hli.classList.add(HEADER);
                ul.insertBefore(hli, ul.children[0]);
            }
            if (this.isMenu) {
                popupWrapper = this.createElement('div', {
                    className: 'e-' + this.getModuleName() + '-wrapper ' + POPUP, id: li.id + '-menu-popup' });
                document.body.appendChild(popupWrapper);
                let isNestedOrVerticalMenu: boolean = this.element.classList.contains('e-vertical') || this.navIdx.length !== 1;
                popupObj = new Popup(popupWrapper, {
                    relateTo: li as HTMLElement,
                    collision: { X: isNestedOrVerticalMenu || this.enableRtl ? 'none' : 'flip', Y: 'fit' },
                    position: isNestedOrVerticalMenu ? { X: 'right', Y: 'top' } : { X: 'left', Y: 'bottom' },
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
                if (this.cssClass) {
                    addClass([popupWrapper], this.cssClass.split(' '));
                }
                popupObj.hide();
                eventArgs = this.triggerBeforeOpen(li, ul, item, e, 0, 0);
                top = eventArgs.top; left = eventArgs.left;
                popupWrapper.style.display = 'block'; popupWrapper.style.maxHeight = popupWrapper.getBoundingClientRect().height + 'px';
                this.addScrolling(popupWrapper, ul, 'vscroll', popupWrapper.offsetHeight, ul.offsetHeight);
                this.checkScrollOffset(e);
                let collide: string[];
                if (!left && !top) {
                    popupObj.refreshPosition(li as HTMLElement, true);
                    left = parseInt(popupWrapper.style.left, 10); top = parseInt(popupWrapper.style.top, 10);
                    if (this.enableRtl) {
                        left = isNestedOrVerticalMenu ? left - popupWrapper.offsetWidth - li.parentElement.offsetWidth
                            : left - popupWrapper.offsetWidth + (li as HTMLElement).offsetWidth;
                    }
                    collide = isCollide(popupWrapper, null, left, top);
                    if ((isNestedOrVerticalMenu || this.enableRtl) && (collide.indexOf('right') > -1 || collide.indexOf('left') > -1)) {
                        popupObj.collision.X = 'none';
                        left = this.enableRtl ? calculatePosition(li, isNestedOrVerticalMenu ? 'right' : 'left', 'top').left : left -
                            popupWrapper.offsetWidth - (closest(li, '.e-' + this.getModuleName() + '-wrapper') as HTMLElement).offsetWidth;
                    }
                    collide = isCollide(popupWrapper, null, left, top);
                    if (collide.indexOf('left') > -1 || collide.indexOf('right') > -1) {
                        left = this.callFit(popupWrapper, true, false, top, left).left;
                    }
                    popupWrapper.style.left = left + 'px';
                } else {
                    popupObj.collision = { X: 'none', Y: 'none' };
                }
                popupWrapper.style.display = '';
            } else {
                ul.style.zIndex = this.element.style.zIndex;
                wrapper.appendChild(ul);
                eventArgs = this.triggerBeforeOpen(li, ul, item, e, top, left);
                top = eventArgs.top; left = eventArgs.left;
            }
        } else {
            ul = this.element;
            ul.style.zIndex = getZindexPartial(target ? target : this.element).toString();
            eventArgs = this.triggerBeforeOpen(li, ul, item, e, top, left);
            top = eventArgs.top; left = eventArgs.left;
        }
        if (eventArgs.cancel) {
            if (this.isMenu) { popupObj.destroy(); detach(popupWrapper); }
            this.navIdx.pop();
        } else {
            if (this.isMenu) {
                this.wireKeyboardEvent(popupWrapper); rippleEffect(popupWrapper, { selector: '.' + ITEM });
                popupWrapper.style.left = left + 'px'; popupWrapper.style.top = top + 'px';
                let animationOptions: AnimationModel = this.animationSettings.effect !== 'None' ? {
                    name: this.animationSettings.effect, duration: this.animationSettings.duration,
                    timingFunction: this.animationSettings.easing
                } : null;
                popupObj.show(animationOptions, li as HTMLElement);
            } else {
                this.setPosition(li, ul, top, left);
                this.toggleAnimation(ul);
            }
        }
    }

    private callFit(element: HTMLElement, x: boolean, y: boolean, top: number, left: number): OffsetPosition {
        return fit(element, null, { X: x, Y: y }, { top: top, left: left });
    }

    private triggerBeforeOpen(
        li: Element, ul: HTMLElement, item: MenuItemModel, e: MouseEvent | KeyboardEvent,
        top: number, left: number): BeforeOpenCloseMenuEventArgs {
        let navIdx: number[] = this.getIndex(li ? li.id : null, true);
        let items: MenuItemModel[] = li ? (<obj>item)[this.getField('children', this.navIdx.length - 1)] as objColl : this.items as objColl;
        let eventArgs: BeforeOpenCloseMenuEventArgs = {
            element: ul, items: items, parentItem: item, event: e, cancel: false, top: top, left: left
        };
        this.trigger('beforeOpen', eventArgs);
        return eventArgs;
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
        let id: string = 'id';
        let listBaseOptions: ListBaseOptions = {
            showIcon: showIcon,
            moduleName: 'menu',
            fields: this.getFields(level),
            template: this.template,
            itemCreating: (args: { curData: obj, fields: obj }): void => {
                if (!args.curData[(<obj>args.fields)[id] as string]) {
                    args.curData[(<obj>args.fields)[id] as string] = getUniqueID('menuitem');
                    this.clearChanges();
                }
                args.curData.htmlAttributes = {
                    role: 'menuitem',
                    tabindex: '-1'
                };
                if (this.isMenu && !(<obj>args.curData)[this.getField('separator', level)]) {
                    (<obj>args.curData.htmlAttributes)['aria-label'] = (<obj>args.curData)[args.fields.text as string];
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
        let ul: HTMLElement = ListBase.createList(
            this.createElement, items as objColl, listBaseOptions, !this.template);
        ul.setAttribute('tabindex', '0');
        if (this.isMenu) {
            ul.setAttribute('role', 'menu');
        }
        return ul;
    }

    private moverHandler(e: MouseEvent): void {
        let wrapper: Element = this.getWrapper();
        let trgt: Element = e.target as Element;
        let cli: Element = this.getLI(trgt);
        if (cli && closest(cli, '.e-' + this.getModuleName() + '-wrapper')) {
            this.removeLIStateByClass([FOCUSED], this.isMenu ? [wrapper].concat(this.getPopups()) : [wrapper]);
            cli.classList.add(FOCUSED);
            if (!this.showItemOnClick) {
                this.clickHandler(e);
            }
        }
        if (this.isMenu) {
            if ((trgt.parentElement !== wrapper && !closest(trgt, '.e-' + this.getModuleName() + '-popup'))
                && (!cli || (cli && !this.getIndex(cli.id, true).length))) {
                this.removeLIStateByClass([FOCUSED, SELECTED], [wrapper]);
                if (this.navIdx.length) {
                    this.closeMenu(null, e);
                }
            }
            wrapper = closest(trgt, '.e-menu-vscroll');
            if (trgt.tagName === 'DIV' && wrapper) {
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

    private clickHandler(e: MouseEvent): void {
        if (this.isTapHold) {
            this.isTapHold = false;
        } else {
            let wrapper: Element = this.getWrapper();
            let trgt: Element = e.target as Element;
            let cli: Element = this.getLI(trgt);
            let cliWrapper: Element = cli ? closest(cli, '.e-' + this.getModuleName() + '-wrapper') : null;
            let isInstLI: boolean = cli && cliWrapper && (this.isMenu ? this.getIndex(cli.id, true).length > 0
                : wrapper.firstElementChild.id === cliWrapper.firstElementChild.id);
            if (isInstLI && e.type === 'click' && !cli.classList.contains(HEADER)) {
                this.setLISelected(cli);
                let navIdx: number[] = this.getIndex(cli.id, true);
                let item: MenuItemModel = this.getItem(navIdx);
                let eventArgs: MenuEventArgs = { element: cli as HTMLElement, item: item };
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
                        let showSubMenu: boolean = true;
                        let cul: Element = cli.parentNode as Element;
                        let cliIdx: number = this.getIdx(cul, cli);
                        if (this.isMenu || !Browser.isDevice) {
                            let culIdx: number = this.isMenu ? Array.prototype.indexOf.call(
                                [wrapper].concat(this.getPopups()), closest(cul, '.' + 'e-' + this.getModuleName() + '-wrapper'))
                                : this.getIdx(wrapper, cul);
                            if (this.navIdx[culIdx] === cliIdx) {
                                showSubMenu = false;
                            }
                            if (culIdx !== this.navIdx.length && (e.type !== 'mouseover' || showSubMenu)) {
                                let sli: Element = this.getLIByClass(cul, SELECTED);
                                if (sli) {
                                    sli.classList.remove(SELECTED);
                                }
                                this.closeMenu(culIdx + 1, e);
                            }
                        }
                        if (showSubMenu) {
                            let idx: number[] = this.navIdx.concat(cliIdx);
                            let item: MenuItemModel = this.getItem(idx);
                            if ((<objColl>(<obj>item)[this.getField('children', idx.length - 1)]) &&
                                (<objColl>(<obj>item)[this.getField('children', idx.length - 1)]).length) {
                                if (e.type === 'mouseover' || (Browser.isDevice && this.isMenu)) {
                                    this.setLISelected(cli);
                                }
                                cli.setAttribute('aria-expanded', 'true');
                                this.navIdx.push(cliIdx);
                                this.openMenu(cli, item, null, null, e);
                            } else {
                                if (e.type !== 'mouseover') {
                                    this.closeMenu(null, e);
                                }
                            }
                        }
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
                        ul.innerHTML = '';
                        let lis: HTMLElement[] = [].slice.call(this.createItems(newProp.items).children);
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
    protected unWireEvents(): void {
        let wrapper: HTMLElement = this.getWrapper() as HTMLElement;
        if (this.target) {
            let target: HTMLElement;
            let touchModule: Touch;
            let targetElems: HTMLElement[] = selectAll(this.target);
            for (let i: number = 0, len: number = targetElems.length; i < len; i++) {
                target = targetElems[i];
                if (Browser.isIos) {
                    touchModule = getInstance(target, Touch) as Touch;
                    if (touchModule) {
                        touchModule.destroy();
                    }
                } else {
                    EventHandler.remove(target, 'contextmenu', this.cmenuHandler);
                }
            }
            for (let parent of getScrollableParent(this.targetElement)) {
                EventHandler.remove(parent, 'scroll', this.scrollHandler);
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
        if (this.animationSettings.effect === 'None' || !isMenuOpen) {
            this.end(ul, isMenuOpen);
        } else {
            this.animation.animate(ul, {
                name: this.animationSettings.effect,
                duration: this.animationSettings.duration,
                timingFunction: this.animationSettings.easing,
                begin: (options: AnimationOptions) => {
                    options.element.style.display = 'block';
                    options.element.style.maxHeight = options.element.getBoundingClientRect().height + 'px';
                },
                end: (options: AnimationOptions) => {
                    this.end(options.element, isMenuOpen);
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

    /**
     * Destroys the widget.
     * @returns void
     */

    public destroy(): void {
        let wrapper: Element = this.getWrapper();
        if (wrapper) {
            super.destroy();
            this.unWireEvents();
            if (this.ngElement && !this.isMenu) {
                this.ngElement.style.display = 'block';
            } else {
                this.closeMenu();
                this.element.innerHTML = '';
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
                wrapper.parentNode.insertBefore(this.element, wrapper);
            }
            if (this.isMenu && this.ngElement) {
                detach(this.element);
                (wrapper as HTMLElement).style.display = '';
                wrapper.classList.remove('e-' + this.getModuleName() + '-wrapper');
                wrapper.removeAttribute('data-ripple');
            } else {
                detach(wrapper);
            }
        }
    }
}

/**
 * Interface for before item render/select event.
 */
export interface MenuEventArgs extends BaseEventArgs {
    element: HTMLElement;
    item: MenuItemModel;
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


