import { Component, NotifyPropertyChanges, INotifyPropertyChanged, ChildProperty, Property, Collection, append, extend, Event, EmitType, BaseEventArgs, EventHandler, closest, addClass, removeClass, detach, remove, initializeCSPTemplate, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ListBase, ListBaseOptions } from '@syncfusion/ej2-lists';
import { Popup } from '@syncfusion/ej2-popups';
import { BreadcrumbModel, BreadcrumbItemModel } from './breadcrumb-model';

type obj = { [key: string]: Object };
const ICONRIGHT: string = 'e-icon-right';
const ITEMTEXTCLASS: string = 'e-breadcrumb-text';
const ICONCLASS: string = 'e-breadcrumb-icon';
const MENUCLASS: string = 'e-breadcrumb-menu';
const ITEMCLASS: string = 'e-breadcrumb-item';
const POPUPCLASS: string = 'e-breadcrumb-popup';
const WRAPMODECLASS: string = 'e-breadcrumb-wrap-mode';
const SCROLLMODECLASS: string = 'e-breadcrumb-scroll-mode';
const TABINDEX: string = 'tabindex';
const DISABLEDCLASS: string = 'e-disabled';
const ARIADISABLED: string = 'aria-disabled';
const DOT: string = '.';
/**
 * Defines the Breadcrumb overflow modes.
 */
export enum BreadcrumbOverflowMode {
    /**
     * Hidden mode shows the maximum number of items possible in the container space and hides the remaining items.
     * Clicking on a previous item will make the hidden item visible.
     */
    Hidden  = 'Hidden',

    /**
     * Collapsed mode shows the first and last Breadcrumb items and hides the remaining items with a collapsed icon.
     * When the collapsed icon is clicked, all items become visible and navigable.
     */
    Collapsed = 'Collapsed',

    /**
     * Menu mode shows the number of Breadcrumb items that can be accommodated within the container space and creates a submenu with the remaining items.
     */
    Menu = 'Menu',

    /**
     * Wrap mode wraps the items to multiple lines when the Breadcrumb’s width exceeds the container space.
     */
    Wrap = 'Wrap',
    /**
     * Scroll mode shows an HTML scroll bar when the Breadcrumb’s width exceeds the container space.
     */
    Scroll = 'Scroll',

    /**
     * None mode shows all the items in a single line.
     */
    None = 'None'
}

export class BreadcrumbItem extends ChildProperty<BreadcrumbItem> {
    /**
     * Specifies the text content of the Breadcrumb item.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Specifies the id of the Breadcrumb item.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies the Url of the Breadcrumb item that will be activated when clicked.
     *
     * @default ''
     */
    @Property('')
    public url: string;

    /**
     * Defines a class/multiple classes separated by a space for the item that is used to include an icon.
     *
     * @default null
     */
    @Property(null)
    public iconCss: string;

    /**
     * Enable or disable the breadcrumb item, when set to true, the breadcrumb item will be disabled.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;
}

/**
 * Interface for item click event.
 */
export interface BreadcrumbClickEventArgs extends BaseEventArgs {
    /**
     * Specifies the item's element.
     */
    element: HTMLElement;
    /**
     * Specifies the Breadcrumb item.
     */
    item: BreadcrumbItemModel;
    /**
     * Specifies the item click event.
     */
    event: Event;
    /**
     * Cancels the Breadcrumb item after click action.
     */
    cancel: boolean;
}

/**
 * Interface for before item render event.
 */
export interface BreadcrumbBeforeItemRenderEventArgs extends BaseEventArgs {
    /**
     * Specifies the item's element.
     */
    element: HTMLElement;
    /**
     * Specifies the Breadcrumb item.
     */
    item: BreadcrumbItemModel;
    /**
     * Cancels the Breadcrumb item rendering.
     */
    cancel: boolean;
}

/**
 * Breadcrumb is a graphical user interface that helps to identify or highlight the current location within a hierarchical structure of websites.
 * The aim is to make the user aware of their current position in a hierarchy of website links.
 * ```html
 * <nav id='breadcrumb'></nav>
 * ```
 * ```typescript
 * <script>
 * var breadcrumbObj = new Breadcrumb({ items: [{ text: 'Home', url: '/' }, { text: 'Index', url: './index.html }]});
 * breadcrumbObj.appendTo("#breadcrumb");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Breadcrumb extends Component<HTMLElement> implements INotifyPropertyChanged {
    private isExpanded: boolean;
    private startIndex: number;
    private endIndex: number;
    private _maxItems: number;
    private popupObj: Popup;
    private popupUl: HTMLElement;
    private delegateClickHanlder: Function;
    private isPopupCreated: boolean = false;
    /**
     * Defines the Url based on which the Breadcrumb items are generated.
     *
     * @default ''
     */
    @Property('')
    public url: string;

    /**
     * Defines the list of Breadcrumb items.
     *
     * @default []
     */
    @Collection<BreadcrumbItemModel>([], BreadcrumbItem)
    public items: BreadcrumbItemModel[];

    /**
     * Specifies the Url of the active Breadcrumb item.
     *
     * @default ''
     */
    @Property('')
    public activeItem: string;

    /**
     * Specifies an integer to enable overflow behavior when the Breadcrumb items count exceeds and it is based on the overflowMode property.
     *
     * @default -1
     * @aspType int
     */
    @Property(-1)
    public maxItems: number;

    /**
     * Specifies the overflow mode of the Breadcrumb item when it exceeds maxItems count. The possible values are,
     * - Default: Specified maxItems count will be visible and the remaining items will be hidden. While clicking on the previous item, the hidden item will become visible.
     * - Collapsed: Only the first and last items will be visible, and the remaining items will be hidden in the collapsed icon. When the collapsed icon is clicked, all items become visible.
     * - Menu: Shows the number of breadcrumb items that can be accommodated within the container space, and creates a sub menu with the remaining items.
     * - Wrap: Wraps the items on multiple lines when the Breadcrumb’s width exceeds the container space.
     * - Scroll: Shows an HTML scroll bar when the Breadcrumb’s width exceeds the container space.
     * - None: Shows all the items on a single line.
     *
     * @isenumeration true
     * @default BreadcrumbOverflowMode.Menu
     * @asptype BreadcrumbOverflowMode
     */
    @Property('Menu')
    public overflowMode: string | BreadcrumbOverflowMode;

    /**
     * Defines class/multiple classes separated by a space in the Breadcrumb element.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies the template for Breadcrumb item.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public itemTemplate: string | Function;

    /**
     * Specifies the separator template for Breadcrumb.
     *
     * @default '/'
     * @aspType string
     */
    @Property('/')
    public separatorTemplate: string | Function;

    /**
     * Enable or disable the item's navigation, when set to false, each item navigation will be prevented.
     *
     * @default true
     */
    @Property(true)
    public enableNavigation: boolean;

    /**
     * Enable or disable the active item navigation, when set to true, active item will be navigable.
     *
     * @default false
     */
    @Property(false)
    public enableActiveItemNavigation: boolean;

    /**
     * Enable or disable the breadcrumb, when set to true, the breadcrumb will be disabled.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     *
     * @default ''
     * @private
     * @aspIgnore
     */
    @Property('')
    public locale: string;

    /**
     * Triggers while rendering each breadcrumb item.
     *
     * @event beforeItemRender
     */
    @Event()
    public beforeItemRender: EmitType<BreadcrumbBeforeItemRenderEventArgs>;

    /**
     * Triggers while clicking the breadcrumb item.
     *
     * @event itemClick
     */
    @Event()
    public itemClick: EmitType<BreadcrumbClickEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Constructor for creating the widget.
     *
     * @private
     * @param {BreadcrumbModel} options - Specifies the Breadcrumb model.
     * @param {string | HTMLElement} element - Specifies the element.
     */
    public constructor(options?: BreadcrumbModel, element?: string | HTMLElement) {
        super(options, <string | HTMLElement>element);
    }

    /**
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        // pre render code
    }

    /**
     * Initialize the control rendering.
     *
     * @private
     * @returns {void}
     */
    protected render(): void {
        this.initialize();
        this.renderItems(this.items);
        this.wireEvents();
    }

    private initialize(): void {
        this._maxItems = this.maxItems;
        if (isNullOrUndefined(this.element.getAttribute('aria-label'))) {
            this.element.setAttribute('aria-label', 'breadcrumb');
        }
        if (this.cssClass) {
            addClass([this.element], this.cssClass.replace(/\s+/g, ' ').trim().split(' '));
        }
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        }
        if (this.disabled) {
            this.element.classList.add(DISABLEDCLASS);
            this.element.setAttribute(ARIADISABLED, 'true');
        }
        if (this.overflowMode === 'Wrap') {
            this.element.classList.add(WRAPMODECLASS);
        } else if (this.overflowMode === 'Scroll') {
            this.element.classList.add(SCROLLMODECLASS);
        }
        this.initItems();
        this.initPvtProps();
    }

    private initPvtProps(): void {
        if (this.overflowMode === 'Hidden' && this._maxItems > 0) {
            this.endIndex = this.getEndIndex();
            this.startIndex = this.endIndex + 1 - (this._maxItems - 1);
        }
        if (this.overflowMode === 'Menu') {
            if (this._maxItems >= 0) {
                this.startIndex = this._maxItems > 1 ? 1 : 0;
                this.endIndex = this.getEndIndex();
                this.popupUl = this.createElement('ul', { attrs: { TABINDEX: '0', 'role': 'menu' } });
            } else {
                this.startIndex = this.endIndex = null;
            }
        }
    }

    private getEndIndex(): number {
        let endIndex: number;
        if (this.activeItem) {
            this.items.forEach((item: BreadcrumbItemModel, idx: number) => {
                if (item.url === this.activeItem || item.text === this.activeItem) {
                    endIndex = idx;
                }
            });
        } else {
            endIndex = this.items.length - 1;
        }
        return endIndex;
    }

    private initItems(): void {
        if (!this.items.length) {
            let baseUri: string;
            let uri: string[];
            const items: BreadcrumbItemModel[] = [];
            if (this.url) {
                const url: URL = new URL(this.url, window.location.origin);
                baseUri = url.origin + '/';
                uri = url.href.split(baseUri)[1].split('/');
            } else {
                baseUri = window.location.origin + '/';
                uri = window.location.href.split(baseUri)[1].split('/');
            }
            items.push({ iconCss: 'e-icons e-home', url: baseUri });
            for (let i: number = 0; i < uri.length; i++) {
                if (uri[i as number]) {
                    items.push({ text: uri[i as number], url: baseUri + uri[i as number] });
                    baseUri += uri[i as number] + '/';
                }
            }
            this.setProperties({ items: items }, true);
        }
    }

    private renderItems(items: BreadcrumbItemModel[]): void {
        let item: BreadcrumbItemModel[] | object[]; let isSingleLevel: boolean;
        const isIconRight: boolean = this.element.classList.contains(ICONRIGHT);
        const itemsLength: number = items.length;
        if (itemsLength) {
            let isActiveItem: boolean;
            let isLastItem: boolean;
            let isLastItemInPopup: boolean;
            let j: number = 0;
            let wrapDiv: HTMLElement;
            const len: number = (itemsLength * 2) - 1;
            let isItemCancelled: boolean = false;
            const ol: HTMLElement = this.createElement('ol', { className: this.overflowMode === 'Wrap' ? 'e-breadcrumb-wrapped-ol' : '' });
            const firstOl: HTMLElement = this.createElement('ol', { className: this.overflowMode === 'Wrap' ? 'e-breadcrumb-first-ol' : '' });
            const showIcon: boolean = this.hasField(items, 'iconCss');
            const isCollasped: boolean = (this.overflowMode === 'Collapsed' && this._maxItems > 0 && itemsLength > this._maxItems && !this.isExpanded);
            const isDefaultOverflowMode: boolean = (this.overflowMode === 'Hidden' && this._maxItems > 0);
            if (this.overflowMode === 'Menu' && this.popupUl) {
                this.popupUl.innerHTML = '';
            }
            const listBaseOptions: ListBaseOptions = {
                moduleName: this.getModuleName(),
                showIcon: showIcon,
                itemNavigable: true,
                itemCreated: (args: { curData: BreadcrumbItemModel, item: HTMLElement, fields: obj }): void => {
                    const isLastItem: boolean = (args.curData as { isLastItem: boolean }).isLastItem;
                    if (isLastItem && args.item.children.length && !this.itemTemplate) {
                        delete (args.curData as { isLastItem: boolean }).isLastItem;
                        if (!isLastItemInPopup && !this.enableActiveItemNavigation) {
                            args.item.innerHTML = this.createElement('span', { className: ITEMTEXTCLASS, innerHTML: args.item.children[0].innerHTML }).outerHTML;
                        }
                    }
                    if (args.curData.iconCss && !args.curData.text && !this.itemTemplate) {
                        args.item.classList.add('e-icon-item');
                    }
                    if (isDefaultOverflowMode) {
                        args.item.setAttribute('item-index', j.toString());
                    }
                    const eventArgs: BreadcrumbBeforeItemRenderEventArgs = {
                        item: extend({}, (args.curData as { properties: object }).properties ?
                            (args.curData as { properties: object }).properties : args.curData), element: args.item, cancel: false
                    };
                    this.trigger('beforeItemRender', eventArgs);
                    isItemCancelled = eventArgs.cancel;
                    const containsRightIcon: boolean = (isIconRight || eventArgs.element.classList.contains(ICONRIGHT));
                    if (containsRightIcon && args.curData.iconCss && !this.itemTemplate) {
                        args.item.querySelector('.e-anchor-wrap').appendChild(args.item.querySelector(DOT + ICONCLASS));
                    }
                    if (eventArgs.item.disabled) {
                        args.item.setAttribute(ARIADISABLED, 'true');
                        args.item.classList.add(DISABLEDCLASS);
                    }
                    if (eventArgs.item.id) {
                        args.item.setAttribute('id', eventArgs.item.id);
                    }
                    if ((eventArgs.item.disabled || this.disabled) && args.item.children.length && !this.itemTemplate) {
                        args.item.children[0].setAttribute(TABINDEX, '-1');
                    }
                    if ((args.curData as { isEmptyUrl: boolean }).isEmptyUrl) {
                        args.item.children[0].removeAttribute('href');
                        if ((!isLastItem || (isLastItem && this.enableActiveItemNavigation)) && !(eventArgs.item.disabled
                            || this.disabled)) {
                            args.item.children[0].setAttribute(TABINDEX, '0');
                            EventHandler.add(args.item.children[0], 'keydown', this.keyDownHandler, this);
                        }
                    }
                    args.item.removeAttribute('role');
                    if (isLastItem) {
                        args.item.setAttribute('data-active-item', '');
                    }
                    if (!this.itemTemplate) {
                        this.beforeItemRenderChanges(args.curData, eventArgs.item, args.item, containsRightIcon);
                    }
                }
            };
            for (let i: number = 0; i < len; (i % 2 && j++), i++) {
                isActiveItem = (this.activeItem && (this.activeItem === items[j as number].url ||
                    this.activeItem === items[j as number].text));
                if (isCollasped && i > 1 && i < len - 2) {
                    continue;
                } else if (isDefaultOverflowMode && ((j < this.startIndex || j > this.endIndex)
                    && (i % 2 ? j !== this.startIndex - 1 : true)) && j !== 0) {
                    continue;
                }
                if (i % 2) {
                    // separator item
                    wrapDiv = this.createElement('div', { className: 'e-breadcrumb-item-wrapper' });
                    if ((this.separatorTemplate && this.separatorTemplate === '/') || isNullOrUndefined(this.separatorTemplate)) {
                        listBaseOptions.template = initializeCSPTemplate( function(): string {
                            return '/';
                        });
                    } else {
                        listBaseOptions.template = this.separatorTemplate as string | Function;
                    }
                    listBaseOptions.itemClass = 'e-breadcrumb-separator';
                    isSingleLevel = false;
                    item = [{ previousItem: items[j as number], nextItem: items[j + 1] }];
                } else {
                    // list item
                    listBaseOptions.itemClass = '';
                    if (this.itemTemplate) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        listBaseOptions.template = this.itemTemplate as any;
                        isSingleLevel = false;
                    } else {
                        isSingleLevel = true;
                    }
                    item = [extend({}, (items[j as number] as { properties: object }).properties ?
                        (items[j as number] as { properties: object }).properties
                        : items[j as number])];
                    if (!(item as BreadcrumbItemModel[])[0].url && !this.itemTemplate) {
                        item = [extend({}, (item as BreadcrumbItemModel[])[0], { isEmptyUrl: true, url: '#' })];
                    }
                    isLastItem = (isDefaultOverflowMode || this.overflowMode === 'Menu') && (j === this.endIndex);
                    if (((i === len - 1 || isLastItem) && !this.itemTemplate) || isActiveItem) {
                        (item[0] as { isLastItem: boolean }).isLastItem = true;
                    }
                }
                let parent: HTMLElement = ol;
                const lastPopupItemIdx: number = this.startIndex + this.endIndex - this._maxItems;
                if (this.overflowMode === 'Menu' && ((j >= this.startIndex && (j <= lastPopupItemIdx && (i % 2 ? !(j === lastPopupItemIdx) : true)) && this.endIndex >= this._maxItems && this._maxItems > 0) || this._maxItems === 0)) {
                    if (i % 2) {
                        continue;
                    } else {
                        parent = this.popupUl;
                        if (isLastItem) {
                            isLastItemInPopup = true;
                        }
                    }
                } else if (this.overflowMode === 'Wrap') {
                    if (i === 0) {
                        parent = firstOl;
                    } else {
                        parent = wrapDiv;
                    }
                }
                const li: NodeList = ListBase.createList(this.createElement, item as { [key: string]: Object; }[],
                                                         listBaseOptions, isSingleLevel, this).childNodes;
                if (!isItemCancelled) {
                    append(li, parent);
                } else if (isDefaultOverflowMode || isCollasped || this.overflowMode === 'Menu' || this.overflowMode === 'Wrap') {
                    items.splice(j, 1);
                    this.initPvtProps();
                    return this.reRenderItems();
                }
                else if ((i === len - 1 || isLastItem)) {
                    remove(parent.lastElementChild);
                }
                if (this.overflowMode === 'Wrap' && i !== 0 && i % 2 === 0) {
                    ol.appendChild(wrapDiv);
                }
                if (isCollasped && i === 1) {
                    const li: Element = this.createElement('li', { className: 'e-icons e-breadcrumb-collapsed', attrs: { TABINDEX: '0' } });
                    EventHandler.add(li, 'keyup', this.expandHandler, this);
                    ol.appendChild(li);
                }
                if (this.overflowMode === 'Menu' && this.startIndex === i && this.endIndex >= this._maxItems && this._maxItems >= 0) {
                    const menu: Element = this.getMenuElement();
                    EventHandler.add(menu, 'keyup', this.keyDownHandler, this);
                    ol.appendChild(menu);
                }
                if (isActiveItem || isLastItem) {
                    break;
                }
                if (isItemCancelled) {
                    i++;
                }
            }
            if ((this as unknown as { isReact: boolean }).isReact) {
                this.renderReactTemplates();
                setTimeout(() => {
                    this.calculateMaxItems();
                }, 5);
            }
            if (this.overflowMode === 'Wrap') {
                this.element.appendChild(firstOl);
            }
            this.element.appendChild(ol);
            if (!(this as unknown as { isReact: boolean }).isReact) {
                this.calculateMaxItems();
            }
        }
    }

    private calculateMaxItems(): void {
        if (this.overflowMode === 'Hidden' || this.overflowMode === 'Collapsed' || this.overflowMode === 'Menu') {
            let maxItems: number;
            const width: number = this.element.offsetWidth;
            const liElems: HTMLElement[] = [].slice.call(this.element.children[0].children).reverse();
            let liWidth: number = this.overflowMode === 'Menu' ? 0 : liElems[liElems.length - 1].offsetWidth + (liElems[liElems.length - 2] ? liElems[liElems.length - 2].offsetWidth : 0);
            if (this.overflowMode === 'Menu') {
                const menuEle: HTMLElement = this.getMenuElement();
                this.element.appendChild(menuEle);
                liWidth += menuEle.offsetWidth;
                remove(menuEle);
            }
            for (let i: number = 0; i < liElems.length - 2; i++) {
                if (liWidth > width) {
                    maxItems = Math.ceil((i - 1) / 2) + ((this.overflowMode === 'Menu' && i <= 2) ? 0 : 1);
                    if (((this.maxItems > maxItems && !(this.maxItems > -1 && maxItems === -1)) ||
                    this.maxItems === -1) && this._maxItems !== maxItems) {
                        this._maxItems = maxItems;
                        this.initPvtProps();
                        return this.reRenderItems();
                    } else {
                        break;
                    }
                } else {
                    if (this.overflowMode === 'Menu' && i === 2) {
                        liWidth += liElems[liElems.length - 1].offsetWidth + liElems[liElems.length - 2].offsetWidth;
                        if (liWidth > width) {
                            this._maxItems = 1;
                            this.initPvtProps();
                            return this.reRenderItems();
                        }
                    }
                    if (!(this.overflowMode === 'Menu' && liElems[i as number].classList.contains(MENUCLASS))) {
                        liWidth += liElems[i as number].offsetWidth;
                    }
                }
            }
        } else if ((this.overflowMode === 'Wrap' || this.overflowMode === 'Scroll') && this._maxItems > 0) {
            let width: number = 0;
            const liElems: NodeListOf<HTMLElement> = this.element.querySelectorAll(DOT + ITEMCLASS);
            if (liElems.length > this._maxItems + this._maxItems - 1) {
                for (let i: number = this.overflowMode === 'Wrap' ? 1 : 0; i < this._maxItems + this._maxItems - 1; i++) {
                    width += liElems[i as number].offsetWidth;
                }
                width = width + 5 + (parseInt(getComputedStyle(this.element.children[0]).paddingLeft, 10) * 2);
                if (this.overflowMode === 'Wrap') {
                    (this.element.querySelector('.e-breadcrumb-wrapped-ol') as HTMLElement).style.width = width + 'px';
                } else {
                    this.element.style.width = width + 'px';
                }
            }
        }
    }

    private hasField(items: BreadcrumbItemModel[], field: string): boolean {
        for (let i: number = 0, len: number = items.length; i < len; i++) {
            if ((<obj>items[i as number])[`${field}`]) {
                return true;
            }
        }
        return false;
    }

    private getMenuElement(): HTMLElement {
        return this.createElement('li', { className: 'e-icons e-breadcrumb-menu', attrs: { TABINDEX: '0' } });
    }

    private beforeItemRenderChanges(prevItem: BreadcrumbItemModel, currItem: BreadcrumbItemModel, elem: Element, isRightIcon: boolean)
        : void {
        const wrapElem: Element = elem.querySelector('.e-anchor-wrap');
        if (wrapElem) {
            wrapElem.parentElement.setAttribute('aria-label', 'home');
        }
        if (currItem.text !== prevItem.text && wrapElem) {
            wrapElem.childNodes.forEach((child: Element) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    child.textContent = currItem.text;
                }
            });
        }
        if (currItem.iconCss !== prevItem.iconCss && wrapElem) { // wrapElem - for checking it is item not a separator
            const iconElem: Element = elem.querySelector(DOT + ICONCLASS);
            if (iconElem) {
                if (currItem.iconCss) {
                    removeClass([iconElem], prevItem.iconCss.split(' '));
                    addClass([iconElem], currItem.iconCss.split(' '));
                } else {
                    remove(iconElem);
                }
            } else if (currItem.iconCss) {
                const iconElem: Element = this.createElement('span', { className: ICONCLASS + ' ' + currItem.iconCss });
                if (isRightIcon) {
                    append([iconElem], wrapElem);
                } else {
                    wrapElem.insertBefore(iconElem, wrapElem.childNodes[0]);
                }
            }
        }
        if (currItem.url !== prevItem.url && this.enableNavigation) {
            const anchor: Element = elem.querySelector('a.' + ITEMTEXTCLASS);
            if (anchor) {
                if (currItem.url) {
                    anchor.setAttribute('href', currItem.url);
                } else {
                    anchor.removeAttribute('href');
                }
            }
        }
    }

    private reRenderItems(): void {
        if (this.overflowMode === 'Menu' && this.popupObj && this.popupObj.element.classList.contains('e-popup-open') && this.popupObj.element.querySelector('.e-edit-template')) {
            this.popupObj.hide();
            this.popupObj.destroy();
            this.isPopupCreated = false;
            detach(this.popupObj.element);
        }
        this.element.innerHTML = '';
        this.renderItems(this.items);
    }

    private clickHandler(e: MouseEvent): void {
        const li: Element = closest(e.target as Element, DOT + ITEMCLASS + ':not(.e-breadcrumb-separator)');
        if (!this.enableNavigation) {
            e.preventDefault();
        }
        if (li && (closest(e.target as Element, DOT + ITEMTEXTCLASS) || this.itemTemplate)) {
            let idx: number;
            if (this.overflowMode === 'Wrap') {
                idx = [].slice.call(this.element.querySelectorAll(DOT + ITEMCLASS)).indexOf(li);
            } else {
                idx = [].slice.call(li.parentElement.children).indexOf(li);
            }
            if (this.overflowMode === 'Menu') {
                if (closest(e.target as Element, DOT + POPUPCLASS)) {
                    idx += this.startIndex;
                    this.endIndex = idx;
                    if (e.type === 'keydown') {
                        this.documentClickHandler(e);
                    }
                } else if (this.element.querySelector(DOT + MENUCLASS)) {
                    if (idx > [].slice.call(this.element.children[0].children).indexOf(this.element.querySelector(DOT + MENUCLASS))) {
                        idx += (this.popupUl.childElementCount * 2) - 2;
                        idx = Math.floor(idx / 2);
                        this.endIndex = idx;
                    } else {
                        this.startIndex = this.endIndex = idx;
                    }
                } else {
                    idx = Math.floor(idx / 2);
                    this.startIndex = this.endIndex = idx;
                }
            } else {
                idx = Math.floor(idx / 2);
            }
            if (this.overflowMode === 'Hidden' && this._maxItems > 0 && this.endIndex !== 0) {
                idx = parseInt(li.getAttribute('item-index'), 10);
                if (this.startIndex > 1) {
                    this.startIndex -= (this.endIndex - idx);
                }
                this.endIndex = idx;
            }
            const itemClickArgs: BreadcrumbClickEventArgs = { element: li as HTMLElement,
                item: this.items[idx as number], event: e, cancel: false };
            this.trigger('itemClick', itemClickArgs);
            if (itemClickArgs.cancel) { return; }
            if (this.items[idx as number]) {
                this.activeItem = this.items[idx as number].url || this.items[idx as number].text;
            }
            this.dataBind();
        }
        if ((e.target as Element).classList.contains('e-breadcrumb-collapsed')) {
            this.isExpanded = true;
            this.reRenderItems();
        }
        if ((e.target as Element).classList.contains(MENUCLASS) && !this.isPopupCreated) {
            this.renderPopup();
        }
    }

    private renderPopup(): void {
        const wrapper: HTMLElement = this.createElement('div', { className: POPUPCLASS + ' ' + this.cssClass + (this.enableRtl ? ' e-rtl' : '') });
        document.body.appendChild(wrapper);
        this.isPopupCreated = true;
        this.popupObj = new Popup(wrapper, {
            content: this.popupUl,
            relateTo: this.element.querySelector(DOT + MENUCLASS) as HTMLElement,
            enableRtl: this.enableRtl,
            position: { X: 'left', Y: 'bottom' },
            collision: { X: 'fit', Y: 'flip' },
            open: (): void => {
                if (this.popupUl) { this.popupUl.focus(); }
            }
        });
        this.popupWireEvents();
        this.popupObj.show();
    }

    private documentClickHandler(e: Event): void {
        if (this.overflowMode === 'Menu' && this.popupObj && this.popupObj.element.classList.contains('e-popup-open') && !closest(e.target as Element, DOT + MENUCLASS) && !closest(e.target as Element, DOT + 'e-edit-template')) {
            this.popupObj.hide();
            this.popupObj.destroy();
            this.isPopupCreated = false;
            detach(this.popupObj.element);
        }
    }

    private resize(): void {
        this._maxItems = this.maxItems;
        this.initPvtProps();
        this.reRenderItems();
    }

    private expandHandler(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            this.isExpanded = true;
            this.reRenderItems();
        }
    }

    private keyDownHandler(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            this.clickHandler(e as unknown as MouseEvent);
        }
    }

    private popupKeyDownHandler(e: KeyboardEvent): void {
        if (e.key === 'Escape') {
            this.documentClickHandler(e);
        }
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @private
     * @param {BreadcrumbModel} newProp - Specifies the new properties.
     * @param {BreadcrumbModel} oldProp - Specifies the old properties.
     * @returns {void}
     */
    public onPropertyChanged(newProp: BreadcrumbModel, oldProp: BreadcrumbModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'enableActiveItemNavigation':
                this.reRenderItems();
                break;
            case 'items':
            case 'activeItem':
                this._maxItems = this.maxItems;
                this.initPvtProps();
                this.reRenderItems();
                break;
            case 'overflowMode':
            case 'maxItems':
                this._maxItems = this.maxItems;
                this.initPvtProps();
                this.reRenderItems();
                if (oldProp.overflowMode === 'Wrap') {
                    this.element.classList.remove(WRAPMODECLASS);
                } else if (newProp.overflowMode === 'Wrap') {
                    this.element.classList.add(WRAPMODECLASS);
                }
                if (oldProp.overflowMode === 'Scroll') {
                    this.element.classList.remove(SCROLLMODECLASS);
                } else if (newProp.overflowMode === 'Scroll') {
                    this.element.classList.add(SCROLLMODECLASS);
                }
                break;
            case 'url':
                this.initItems();
                this.reRenderItems();
                break;
            case 'cssClass':
                if (oldProp.cssClass) {
                    removeClass([this.element], oldProp.cssClass.split(' '));
                }
                if (newProp.cssClass) {
                    addClass([this.element], newProp.cssClass.replace(/\s+/g, ' ').trim().split(' '));
                }
                if ((oldProp.cssClass && oldProp.cssClass.indexOf(ICONRIGHT) > -1) && !(newProp.cssClass &&
                    newProp.cssClass.indexOf(ICONRIGHT) > -1) || !(oldProp.cssClass && oldProp.cssClass.indexOf(ICONRIGHT) > -1) &&
                    (newProp.cssClass && newProp.cssClass.indexOf(ICONRIGHT) > -1)) {
                    this.reRenderItems();
                }
                break;
            case 'enableRtl':
                this.element.classList.toggle('e-rtl');
                break;
            case 'disabled':
                this.element.classList.toggle(DISABLEDCLASS);
                this.element.setAttribute(ARIADISABLED, newProp.disabled + '');
                break;
            }
        }
    }

    private wireEvents(): void {
        this.delegateClickHanlder = this.documentClickHandler.bind(this);
        EventHandler.add(document, 'click', this.delegateClickHanlder, this);
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        window.addEventListener('resize', this.resize.bind(this));
    }

    private popupWireEvents(): void {
        EventHandler.add(this.popupObj.element, 'click', this.clickHandler, this);
        EventHandler.add(this.popupObj.element, 'keydown', this.popupKeyDownHandler, this);
    }

    private unWireEvents(): void {
        EventHandler.remove(document, 'click', this.delegateClickHanlder);
        EventHandler.remove(this.element, 'click', this.clickHandler);
        window.removeEventListener('resize', this.resize.bind(this));
        if (this.popupObj) {
            EventHandler.remove(this.popupObj.element, 'click', this.clickHandler);
            EventHandler.remove(this.popupObj.element, 'keydown', this.popupKeyDownHandler);
        }
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist data
     */
    protected getPersistData(): string {
        return this.addOnPersist(['activeItem']);
    }

    /**
     * Get module name.
     *
     * @private
     * @returns {string} - Module Name
     */
    protected getModuleName(): string {
        return 'breadcrumb';
    }

    /**
     * Destroys the widget.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.popupObj && this.popupObj.element.classList.contains('e-popup-open')) {
            this.popupObj.destroy();
            this.isPopupCreated = false;
            detach(this.popupObj.element);
        }
        const classes: string[] = [];
        const attributes: string[] = ['aria-label'];
        if (this.cssClass) {
            classes.concat(this.cssClass.split(' '));
        }
        if (this.enableRtl) {
            classes.push('e-rtl');
        }
        if (this.disabled) {
            classes.push(DISABLEDCLASS);
            attributes.push(ARIADISABLED);
        }
        if (this.overflowMode === 'Wrap') {
            classes.push(WRAPMODECLASS);
        } else if (this.overflowMode === 'Scroll') {
            classes.push(SCROLLMODECLASS);
        }
        this.unWireEvents();
        this.element.innerHTML = '';
        removeClass([this.element], classes);
        attributes.forEach((attribute: string) => {
            this.element.removeAttribute(attribute);
        });
        super.destroy();
    }
}
