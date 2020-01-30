import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, Event, EmitType, ChildProperty } from '@syncfusion/ej2-base';
import { getComponent, closest, EventHandler, getUniqueID } from '@syncfusion/ej2-base';
import { Collection, Complex } from '@syncfusion/ej2-base';
import { Tab, Toolbar, ItemModel, SelectingEventArgs, MenuItemModel, ClickEventArgs, TabItemModel } from '@syncfusion/ej2-navigations';
import { Menu, MenuEventArgs, BeforeOpenCloseMenuEventArgs, Item, MenuItem } from '@syncfusion/ej2-navigations';
import { SelectEventArgs as TabSelectEventArgs } from '@syncfusion/ej2-navigations';
import { RibbonModel, RibbonItemModel, RibbonHeaderModel } from './ribbon-model';
import { SelectEventArgs } from '@syncfusion/ej2-dropdowns';

/**
 * Objects used for configuring the Ribbon tab header properties.
 */
export class RibbonHeader extends ChildProperty<RibbonHeader> {
    /**
     * Specifies the display text of the Ribbon tab header.
     * @default ''
     */
    @Property('')
    public text: string;
    /**
     * Specifies the icon class that is used to render an icon in the Ribbon tab header.
     * @default ''
     */
    @Property('')
    public iconCss: string;
    /**
     * Options for positioning the icon in the Ribbon tab header. This property depends on `iconCss` property.
     * The possible values are:
     * - Left: Places the icon to the `left` of the item.
     * - Top: Places the icon on the `top` of the item.
     * - Right: Places the icon to the `right` end of the item.
     * - Bottom: Places the icon at the `bottom` of the item.
     * @default 'left'
     */
    @Property('left')
    public iconPosition: string;
}

/**
 * An array of object that is used to configure the Tab.
 */
export class RibbonItem extends ChildProperty<RibbonItem> {
    /**
     * The object used for configuring the Tab item header properties.
     * @default {}
     */
    @Complex<RibbonHeaderModel>({}, RibbonHeader)
    public header: RibbonHeaderModel;
    /**
     * Specifies the content of Tab item, that is displayed when concern item header is selected.
     * @default ''
     */
    @Collection<ItemModel>([], Item)
    public content: ItemModel[];
    /**
     * Sets the CSS classes to the Tab item to customize its styles.
     * @default ''
     */
    @Property({})
    public cssClass: string;
    /**
     * Sets true to disable user interactions of the Tab item.
     * @default false
     */
    @Property(false)
    public disabled: boolean;
}

/**
 * Interface for ribbon content expand/collapse event.
 */
export interface ExpandCollapseEventArgs {
    /** Ribbon content element */
    element: HTMLElement;
    /** Represent whether the ribbon content is expanded/collapsed */
    expanded: boolean;
}

/**
 * Represents Ribbon component.
 */
@NotifyPropertyChanges
export class Ribbon extends Component<HTMLDivElement> implements INotifyPropertyChanged {
    private toolbarObj: Toolbar;
    private tabObj: Tab;

    /**
     * Defines class/multiple classes separated by a space in the Spreadsheet element.
     * @default ""
     */
    @Property('')
    public cssClass: string;

    /**
     * Used the specify the ribbon menu type as `Menu` or `Sidebar`.
     * @default true
     */
    @Property(true)
    public menuType: boolean;

    /**
     * An array of object that is used to configure the Ribbon menu.
     * @default []
     */
    @Collection<MenuItemModel>([], MenuItem)
    public menuItems: MenuItemModel[];

    /**
     * Specifies the index for activating the current Ribbon tab.
     * @default 0
     */
    @Property(0)
    public selectedTab: number;

    /**
     * An array of object that is used to configure the Ribbon tab.
     * @default []
     */
    @Collection<RibbonItemModel>([], RibbonItem)
    public items: RibbonItemModel[];

    /**
     * Triggers while selecting the tab item.
     * @event
     */
    @Event()
    public selecting: EmitType<SelectingEventArgs>;

    /**
     * Triggers while selecting the file menu item.
     * @event
     */
    @Event()
    public fileItemSelect: EmitType<MenuEventArgs>;

    /**
     * Triggers while rendering each file menu item.
     * @event
     */
    @Event()
    public beforeFileItemRender: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the file menu.
     * @event
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the file menu.
     * @event
     */
    @Event()
    public beforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers format dropdown items gets selected.
     * @event
     * @hidden
     */
    @Event()
    public selectFormat: EmitType<SelectEventArgs>;

    /**
     * Triggers while clicking the ribbon content elements.
     * @event
     */
    @Event()
    public clicked: EmitType<ClickEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Triggers once the component rendering is completed.
     * @event
     */
    @Event()
    public expandCollapse: EmitType<ExpandCollapseEventArgs>;

    /**
     * Constructor for creating the widget.
     * @param  {RibbonModel} options?
     * @param  {string|HTMLDivElement} element?
     */
    constructor(options?: RibbonModel, element?: string | HTMLDivElement) {
        super(options);
    }

    /**
     * For internal use only.
     * @returns void
     * @private
     */
    protected preRender(): void {
        /** */
    }

    /**
     * For internal use only.
     * @returns void
     * @private
     */
    protected render(): void {
        if (!this.element.id) { this.element.id = getUniqueID('ribbon'); }
        this.renderRibbon();
    }

    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        let expandCollapseElem: HTMLElement = this.tabObj.element.querySelector('.e-drop-icon');
        if (expandCollapseElem) {
            expandCollapseElem.removeEventListener('click', this.ribbonExpandCollapse.bind(this));
        }
        if (this.menuItems.length) {
            let fileMenu: HTMLElement = document.getElementById(`${this.element.id}_menu_items`);
            if (fileMenu) { (getComponent(fileMenu, 'menu') as Menu).destroy(); }
        }
        this.toolbarObj.destroy();
        this.tabObj.destroy();
        this.toolbarObj = null; this.tabObj = null;
        super.destroy();
    }

    private getTabItems(): TabItemModel[] {
        let tabItems: TabItemModel[] = [];
        if (this.menuItems.length) {
            tabItems.push({
                header: { text: this.initMenu(this.menuItems) },
                content: this.toolbarObj.element,
                cssClass: 'e-menu-tab'
            });
        }
        this.items.forEach((item: RibbonItem): void => {
            tabItems.push({
                header: item.header,
                content: this.toolbarObj.element
            });
        });
        return tabItems;
    }

    private initMenu(menuItems: MenuItemModel[]): HTMLElement {
        let menu: HTMLElement = this.createElement('ul', { id: `${this.element.id}_menu_items` });
        this.element.appendChild(menu);
        let menuObj: Menu = new Menu({
            cssClass: 'e-file-menu',
            items: menuItems,
            showItemOnClick: true,
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.parentItem.text === menuItems[0].text) { menuObj.showItemOnClick = false; }
                this.trigger('beforeOpen', args);
            },
            select: (args: MenuEventArgs): void => {
                this.trigger('fileItemSelect', args);
            },
            beforeClose: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.event.type === 'mouseover' && !closest(args.event.target as Element, '.e-menu-popup')) {
                    args.cancel = true; return;
                }
                this.trigger('beforeClose', args);
                if (!args.parentItem || args.parentItem.text === menuItems[0].text) {
                    requestAnimationFrame((): void => menuObj.setProperties({ showItemOnClick: true }, true));
                }
            },
            beforeItemRender: (args: MenuEventArgs): void => {
                this.trigger('beforeFileItemRender', args);
            }
        });
        menuObj.createElement = this.createElement;
        menuObj.appendTo(menu);
        return menu.parentElement;
    }

    private renderRibbon(): void {
        let tabElement: HTMLElement = this.createElement('div');
        let tBarElement: HTMLElement = this.createElement('div');
        this.toolbarObj = new Toolbar({
            items: this.items[this.selectedTab].content,
            clicked: (args: ClickEventArgs) => this.trigger('clicked', args)
        });
        this.toolbarObj.createElement = this.createElement;
        this.toolbarObj.appendTo(tBarElement);
        this.tabObj = new Tab({
            selectedItem: this.getIndex(this.selectedTab),
            animation: { next: { duration: 0 }, previous: { duration: 0 } },
            items: this.getTabItems(),
            selecting: (args: SelectingEventArgs): void => {
                if (this.menuItems.length && args.selectingIndex === 0) {
                    args.cancel = true;
                } else {
                    this.toolbarObj.items = this.items[this.getIndex(args.selectingIndex, true)].content;
                    this.toolbarObj.dataBind();
                    if (this.element.classList.contains('e-collapsed')) {
                        EventHandler.remove(args.selectedItem, 'click', this.ribbonExpandCollapse);
                    }
                    let eventArgs: SelectingEventArgs;
                    if (this.menuItems.length) {
                        eventArgs = { ...{}, ...args };
                        eventArgs.selectingIndex -= 1; eventArgs.selectedIndex -= 1;
                    } else {
                        eventArgs = args;
                    }
                    this.trigger('selecting', eventArgs);
                }
            },
            selected: (args: TabSelectEventArgs): void => {
                this.setProperties({ 'selectedTab': this.getIndex(args.selectedIndex, true) }, true);
                if (this.element.classList.contains('e-collapsed')) {
                    this.element.classList.remove('e-collapsed');
                    this.trigger('expandCollapse', { element: this.toolbarObj.element, expanded: true });
                }
            },
            created: (): void => {
                let collapseBtn: Element = this.createElement('span', { className: 'e-drop-icon e-icons' });
                collapseBtn.addEventListener('click', this.ribbonExpandCollapse.bind(this));
                this.tabObj.element.querySelector('.e-tab-header').appendChild(collapseBtn);
                this.toolbarObj.refreshOverflow();
            }
        });
        this.element.appendChild(tabElement);
        this.tabObj.createElement = this.createElement;
        this.tabObj.appendTo(tabElement);
    }

    private ribbonExpandCollapse(e: MouseEvent): void {
        let eventArgs: ExpandCollapseEventArgs = { element: this.toolbarObj.element, expanded: true };
        let activeTab: Element;
        if (this.element.classList.contains('e-collapsed')) {
            activeTab = this.tabObj.element.querySelector('.e-tab-header').getElementsByClassName(
                'e-toolbar-item')[this.tabObj.selectedItem];
            this.element.classList.remove('e-collapsed');
            activeTab.classList.add('e-active');
            EventHandler.remove(activeTab, 'click', this.ribbonExpandCollapse);
            this.trigger('expandCollapse', eventArgs);
        } else {
            activeTab = this.tabObj.element.querySelector('.e-tab-header .e-toolbar-item.e-active');
            this.element.classList.add('e-collapsed'); eventArgs.expanded = false;
            activeTab.classList.remove('e-active');
            EventHandler.add(activeTab, 'click', this.ribbonExpandCollapse, this);
            this.trigger('expandCollapse', eventArgs);
        }
    }

    private getIndex(index: number, decrement?: boolean): number {
        return this.menuItems.length ? (decrement ? index - 1 : index + 1) : index;
    }

    /**
     * Enables or disables the specified Ribbon items or all ribbon items.
     * @param  {boolean} enable  - Boolean value that determines whether the command should be enabled or disabled.
     * @param  {HTMLElement} items - DOM element or an array of items to be enabled or disabled.
     * By default, `isEnable` is set to true.
     * @returns void.
     */
    public enableItems(enable: boolean, items?: HTMLElement): void {
        if (items) {
            this.toolbarObj.enableItems(items, enable);
        } else {
            this.toolbarObj.disable(!enable);
        }
    }

    /**
     * To enable / disable the ribbon menu items.
     * @param {string[]} items - Items that needs to be enabled / disabled.
     * @param {boolean} enable - Set `true` / `false` to enable / disable the menu items.
     * @returns void.
     */
    public enableMenuItems(items: string[], enable: boolean = true): void {
        if (!this.menuItems.length) { return; }
        (getComponent(document.getElementById(`${this.element.id}_menu_items`), 'menu') as Menu).enableItems(items, enable);
    }

    /**
     * To add custom tabs.
     * @param {RibbonItemModel[]} items - Specifies the Ribbon tab items to be inserted.
     * @param {string} insertBefore? - specifies the existing Ribbon header text before which the new tabs will be inserted.
     * If not specified, the new tabs will be inserted at the end.
     */
    public addTabs(items: RibbonItemModel[], insertBefore?: string): void {
        let idx: number = this.getTabIndex(insertBefore);
        items.forEach((item: RibbonItemModel): void => {
            item = new RibbonItem(<RibbonItem>this.items[0], 'items', item, true);
            this.items.splice(idx, 0, item);
            this.tabObj.addTab([{ header: item.header, content: this.toolbarObj.element }], this.getIndex(idx));
            idx++;
        });
        this.setProperties({ 'selectedTab': this.getIndex(this.tabObj.selectedItem, true) }, true);
    }

    private getTabIndex(headerText: string): number {
        let idx: number = this.items.length;
        if (headerText) {
            for (let i: number = 0; i < this.items.length; i++) {
                if (this.items[i].header.text === headerText) { idx = i; break; }
            }
        }
        return idx;
    }

    /**
     * To add the custom items in Ribbon toolbar.
     * @param {string} tab - Specifies the ribbon tab header text under which the specified items will be inserted..
     * @param {ItemModel[]} items - specifies the ribbon toolbar items that needs to be inserted.
     * @param {number} index? - specifies the index text before which the new items will be inserted.
     * If not specified, the new items will be inserted at the end of the toolbar.
     */
    public addToolbarItems(tab: string, items: ItemModel[], index?: number): void {
        let tabIdx: number = this.getTabIndex(tab);
        if (!index) { index = this.items[tabIdx].content.length; }
        items.forEach((item: ItemModel): void => {
            item = new Item(<Item>this.items[tabIdx].content[0], 'content', item, true);
            this.items[tabIdx].content.splice(index, 0, item); index++;
        });
        if (tabIdx === this.selectedTab && items.length) {
            this.toolbarObj.items = this.items[tabIdx].content; this.toolbarObj.dataBind();
        }
    }

    /**
     * Get component name.
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'ribbon';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @private
     */
    public getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * Called internally if any of the property value changed.
     * @param  {RibbonModel} newProp
     * @param  {RibbonModel} oldProp
     * @returns void
     * @private
     */
    public onPropertyChanged(newProp: RibbonModel, oldProp: RibbonModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'selectedTab':
                    this.tabObj.selectedItem = this.getIndex(newProp.selectedTab); this.tabObj.dataBind();
                    break;
            }
        }
    }
}