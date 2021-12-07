import { Component, NotifyPropertyChanges, INotifyPropertyChanged, ChildProperty, Property, Collection, append, extend, Event, EmitType, BaseEventArgs, EventHandler, closest, addClass, removeClass } from '@syncfusion/ej2-base';
import { ListBase, ListBaseOptions } from '@syncfusion/ej2-lists';
import { BreadcrumbModel, BreadcrumbItemModel } from './breadcrumb-model';

type obj = { [key: string]: Object };
const ICONRIGHT: string = 'e-icon-right';
const ITEMTEXTCLASS: string = 'e-breadcrumb-text';
const ICONCLASS: string = 'e-breadcrumb-icon';
/**
 * Defines the Breadcrumb overflow modes.
 */
export type BreadcrumbOverflowMode = 'Default' | 'Collapsed';

export class BreadcrumbItem extends ChildProperty<BreadcrumbItem> {
    /**
     * Specifies the text content of the Breadcrumb item.
     *
     * @default ''
     */
    @Property('')
    public text: string;

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
     * @default 0
     */
    @Property(0)
    public maxItems: number;

    /**
     * Specifies the overflow mode of the Breadcrumb item when it exceeds maxItems count. The possible values are,
     * - Default: Specified maxItems count will be visible and the remaining items will be hidden. While clicking on the previous item, the hidden item will become visible.
     * - Collapsed: Only the first and last items will be visible, and the remaining items will be hidden in the collapsed icon. When the collapsed icon is clicked, all items become visible.
     *
     * @default 'Default'
     */
    @Property('Default')
    public overflowMode: BreadcrumbOverflowMode;

    /**
     * Defines class/multiple classes separated by a space in the Breadcrumb element.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies the width for the Breadcrumb component container element. If the Breadcrumb items overflow, the browsers horizontal scroll will be activated based on the device.
     *
     * @default ''
     */
    @Property('')
    public width: string;

    /**
     * Specifies the template for Breadcrumb item.
     *
     * @default null
     */
    @Property(null)
    public itemTemplate: string;

    /**
     * Specifies the separator template for Breadcrumb.
     *
     * @default '/'
     */
    @Property('/')
    public separatorTemplate: string;

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
        this.element.setAttribute('aria-label', 'breadcrumb');
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
        this.setWidth();
        this.initItems();
        this.initPvtProps();
    }

    private initPvtProps(): void {
        if (this.overflowMode === 'Default' && this._maxItems > 0) {
            this.startIndex = this.items.length - (this._maxItems - 1);
            this.endIndex = this.items.length - 1;
        }
    }

    private setWidth(): void {
        if (this.width) {
            this.element.style.width = this.width;
        }
    }

    private initItems(): void {
        if (!this.items.length) {
            let baseUri: string;
            let uri: string[];
            const items: BreadcrumbItemModel[] = [];
            if (this.url) {
                const url: URL = new URL(this.url);
                baseUri = url.origin + '/';
                uri = url.href.split(baseUri)[1].split('/');
            } else {
                baseUri = window.location.origin + '/';
                uri = window.location.href.split(baseUri)[1].split('/');
            }
            items.push({ iconCss: 'e-icons e-home', url: baseUri });
            for (let i: number = 0; i < uri.length; i++) {
                items.push({ text: uri[i], url: baseUri + uri[i] });
                baseUri += uri[i] + '/';
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
            let j: number = 0;
            const len: number = (itemsLength * 2) - 1;
            const ol: HTMLElement = this.createElement('ol');
            const showIcon: boolean = this.hasField(items, 'iconCss');
            const isDisabled: boolean = this.element.classList.contains('e-disabled');
            const isCollasped: boolean = (this.overflowMode === 'Collapsed' && this._maxItems > 0 && itemsLength > this.maxItems && !this.isExpanded);
            const isDefaultOverflowMode: boolean = (this.overflowMode === 'Default' && this._maxItems > 0);
            const listBaseOptions: ListBaseOptions = {
                moduleName: this.getModuleName(),
                showIcon: showIcon,
                itemNavigable: true,
                itemCreated: (args: { curData: BreadcrumbItemModel, item: HTMLElement, fields: obj }): void => {
                    const isLastItem: boolean = (args.curData as { isLastItem: boolean }).isLastItem;
                    if ((args.curData as { isEmptyUrl: boolean }).isEmptyUrl) {
                        args.item.children[0].removeAttribute('href');
                        if (!isLastItem || (isLastItem && this.enableActiveItemNavigation)) {
                            args.item.children[0].setAttribute('tabindex', '0');
                            EventHandler.add(args.item.children[0], 'keydown', this.keyDownHandler, this);
                        }
                    }
                    if (isLastItem && args.item.children.length && !this.itemTemplate) {
                        delete (args.curData as { isLastItem: boolean }).isLastItem;
                        args.item.innerHTML = this.createElement('span', { className: ITEMTEXTCLASS, innerHTML: args.item.children[0].innerHTML }).outerHTML;
                    }
                    if (args.curData.iconCss && !args.curData.text && !this.itemTemplate) {
                        args.item.classList.add('e-icon-item');
                    }
                    if (isDefaultOverflowMode) {
                        args.item.setAttribute('item-index', j.toString());
                    }
                    if (args.item.querySelector('.' + ITEMTEXTCLASS)) {
                        EventHandler.add(args.item.querySelector('.' + ITEMTEXTCLASS), 'focus', () => {
                            args.item.classList.add('e-focus');
                        }, this);
                        EventHandler.add(args.item.querySelector('.' + ITEMTEXTCLASS), 'focusout', () => {
                            args.item.classList.remove('e-focus');
                        }, this);
                    }
                    const eventArgs: BreadcrumbBeforeItemRenderEventArgs = {
                        item: extend({}, (args.curData as { properties: object }).properties ?
                            (args.curData as { properties: object }).properties : args.curData), element: args.item
                    };
                    this.trigger('beforeItemRender', eventArgs);
                    const containsRightIcon: boolean = (isIconRight || eventArgs.element.classList.contains(ICONRIGHT));
                    if (containsRightIcon && args.curData.iconCss && !this.itemTemplate) {
                        args.item.querySelector('.e-anchor-wrap').append(args.item.querySelector('.' + ICONCLASS));
                    }
                    if (isDisabled || eventArgs.element.classList.contains('e-disabled')) {
                        args.item.setAttribute('aria-disabled', 'true');
                    }
                    if (!this.itemTemplate) {
                        this.beforeItemRenderChanges(args.curData, eventArgs.item, args.item, containsRightIcon);
                    }
                }
            };
            for (let i: number = 0; i < len; (i % 2 && j++), i++) {
                isActiveItem = (this.activeItem && this.activeItem === items[j].url);
                if (isCollasped && i > 1 && i < len - 2) {
                    continue;
                } else if (isDefaultOverflowMode && ((j < this.startIndex || j > this.endIndex)
                    && (i % 2 ? j !== this.startIndex - 1 : true)) && j !== 0) {
                    continue;
                }
                if (i % 2) {
                    // separator item
                    listBaseOptions.template = this.separatorTemplate ? this.separatorTemplate : '/';
                    listBaseOptions.itemClass = 'e-breadcrumb-separator';
                    isSingleLevel = false;
                    item = [{ previousItem: (item as []).pop(), nextItem: items[j] }];
                } else {
                    // list item
                    listBaseOptions.itemClass = '';
                    if (this.itemTemplate) {
                        listBaseOptions.template = this.itemTemplate;
                        isSingleLevel = false;
                    } else {
                        isSingleLevel = true;
                    }
                    item = [extend({}, (items[j] as { properties: object }).properties ? (items[j] as { properties: object }).properties
                        : items[j])];
                    if (!(item as BreadcrumbItemModel[])[0].url && !this.itemTemplate) {
                        item = [extend({}, (item as BreadcrumbItemModel[])[0], { isEmptyUrl: true, url: '#' })];
                    }
                    isLastItem = isDefaultOverflowMode && (j === this.endIndex);
                    if ((((i === len - 1 || isLastItem) && !this.itemTemplate) || isActiveItem) && !this.enableActiveItemNavigation) {
                        (item[0] as { isLastItem: boolean }).isLastItem = true;
                    }
                }
                append(ListBase.createList(this.createElement, item as { [key: string]: Object; }[], listBaseOptions, isSingleLevel, this)
                    .childNodes, ol);
                if (isCollasped && i === 1) {
                    const li: Element = this.createElement('li', { className: 'e-icons e-breadcrumb-collapsed', attrs: { 'tabindex': '0' } });
                    EventHandler.add(li, 'keyup', this.expandHandler, this);
                    ol.append(li);
                }
                if (isActiveItem || isLastItem) {
                    break;
                }
            }
            if ((this as unknown as { isReact: boolean }).isReact) {
                this.renderReactTemplates();
            }
            this.element.append(ol);
            this.calculateMaxItems();
        }
    }

    private calculateMaxItems(): void {
        if (!this._maxItems) {
            if (this.overflowMode === 'Default' || this.overflowMode === 'Collapsed') {
                const width: number = this.element.offsetWidth;
                let liWidth: number = (this.element.children[0].children[0] as HTMLElement).offsetWidth;
                const liElems: HTMLElement[] = [].slice.call(this.element.children[0].children).reverse();
                for (let i: number = 0; i < liElems.length; i++) {
                    if (liWidth > width) {
                        this._maxItems = Math.ceil((i - 1) / 2) + 1;
                        this.initPvtProps();
                        return this.reRenderItems();
                    } else {
                        liWidth += liElems[i].offsetWidth;
                    }
                }
            }
        }
    }

    private hasField(items: BreadcrumbItemModel[], field: string): boolean {
        for (let i: number = 0, len: number = items.length; i < len; i++) {
            if ((<obj>items[i])[field]) {
                return true;
            }
        }
        return false;
    }

    private beforeItemRenderChanges(prevItem: BreadcrumbItemModel, currItem: BreadcrumbItemModel, elem: Element, isRightIcon: boolean)
        : void {
        const wrapElem: Element = elem.querySelector('.e-anchor-wrap');
        if (currItem.text !== prevItem.text) {
            wrapElem.childNodes.forEach((child: Element) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    child.textContent = currItem.text;
                }
            });
        }
        if (currItem.iconCss !== prevItem.iconCss) {
            const iconElem: Element = elem.querySelector('.' + ICONCLASS);
            if (iconElem) {
                if (currItem.iconCss) {
                    removeClass([iconElem], prevItem.iconCss.split(' '));
                    addClass([iconElem], currItem.iconCss.split(' '));
                } else {
                    iconElem.remove();
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
        this.element.innerHTML = '';
        this.renderItems(this.items);
    }

    private clickHandler(e: MouseEvent): void {
        const li: Element = closest(e.target as Element, '.e-breadcrumb-item');
        if (li && (closest(e.target as Element, '.' + ITEMTEXTCLASS) || this.itemTemplate)) {
            let idx: number = [].slice.call(li.parentElement.children).indexOf(li);
            idx = Math.floor(idx / 2);
            if (this.overflowMode === 'Default' && this._maxItems > 0 && this.endIndex !== 0) {
                idx = parseInt(li.getAttribute('item-index'), 10);
                if (this.startIndex > 1) {
                    this.startIndex -= (this.endIndex - idx);
                }
                this.endIndex = idx;
                this.reRenderItems();
            }
            this.trigger('itemClick', { element: li, item: this.items[idx], event: e });
            if (this.items[idx].url) {
                this.activeItem = this.items[idx].url;
                this.dataBind();
            }
        }
        if (!this.enableNavigation) {
            e.preventDefault();
        }
        if ((e.target as Element).classList.contains('e-breadcrumb-collapsed')) {
            this.isExpanded = true;
            this.reRenderItems();
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
                case 'activeItem':
                case 'items':
                case 'enableActiveItemNavigation':
                    this.reRenderItems();
                    break;
                case 'overflowMode':
                case 'maxItems':
                    this.initPvtProps();
                    this.reRenderItems();
                    break;
                case 'url':
                    this.initItems();
                    this.reRenderItems();
                    break;
                case 'width':
                    this.setWidth();
                    this._maxItems = this.maxItems;
                    this.initPvtProps();
                    this.reRenderItems();
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([this.element], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([this.element], newProp.cssClass.split(' '));
                    }
                    if ((oldProp.cssClass && oldProp.cssClass.indexOf(ICONRIGHT) > -1) && !(newProp.cssClass &&
                        newProp.cssClass.indexOf(ICONRIGHT) > -1) || !(oldProp.cssClass && oldProp.cssClass.indexOf(ICONRIGHT) > -1) &&
                        (newProp.cssClass && newProp.cssClass.indexOf(ICONRIGHT) > -1)) {
                        this.reRenderItems();
                    }
                    break;
            }
        }
    }

    private wireEvents(): void {
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        window.addEventListener('resize', this.resize.bind(this));
    }

    private unWireEvents(): void {
        EventHandler.remove(this.element, 'click', this.clickHandler);
        window.removeEventListener('resize', this.resize.bind(this));
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
        this.unWireEvents();
        this.element.innerHTML = '';
        if (this.cssClass) {
            removeClass([this.element], this.cssClass.split(' '));
        }
    }
}
