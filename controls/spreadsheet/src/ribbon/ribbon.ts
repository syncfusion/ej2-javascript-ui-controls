/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, Event, EmitType, ChildProperty } from '@syncfusion/ej2-base';
import { getComponent, closest, EventHandler, getUniqueID, isNullOrUndefined } from '@syncfusion/ej2-base';
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
     *
     * @default ''
     */
    @Property('')
    public text: string;
    /**
     * Specifies the icon class that is used to render an icon in the Ribbon tab header.
     *
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
     *
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
     *
     * @default {}
     */
    @Complex<RibbonHeaderModel>({}, RibbonHeader)
    public header: RibbonHeaderModel;
    /**
     * Specifies the content of Tab item, that is displayed when concern item header is selected.
     *
     * @default ''
     */
    @Collection<ItemModel>([], Item)
    public content: ItemModel[];
    /**
     * Sets the CSS classes to the Tab item to customize its styles.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Sets true to disable user interactions of the Tab item.
     *
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
    public tabObj: Tab;

    /**
     * Defines class/multiple classes separated by a space in the Spreadsheet element.
     *
     * @default ""
     */
    @Property('')
    public cssClass: string;

    /**
     * Used the specify the ribbon menu type as `Menu` or `Sidebar`.
     *
     * @default true
     */
    @Property(true)
    public menuType: boolean;

    /**
     * An array of object that is used to configure the Ribbon menu.
     *
     * @default []
     */
    @Collection<MenuItemModel>([], MenuItem)
    public menuItems: MenuItemModel[];

    /**
     * Specifies the index for activating the current Ribbon tab.
     *
     * @default 0
     */
    @Property(0)
    public selectedTab: number;

    /**
     * An array of object that is used to configure the Ribbon tab.
     *
     * @default []
     */
    @Collection<RibbonItemModel>([], RibbonItem)
    public items: RibbonItemModel[];

    /**
     * Triggers while selecting the tab item.
     *
     * @event anEvent
     */
    @Event()
    public selecting: EmitType<SelectingEventArgs>;

    /**
     * Triggers while selecting the file menu item.
     *
     * @event anEvent
     */
    @Event()
    public fileMenuItemSelect: EmitType<MenuEventArgs>;

    /**
     * Triggers while rendering each file menu item.
     *
     * @event anEvent
     */
    @Event()
    public beforeFileMenuItemRender: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the file menu.
     *
     * @event anEvent
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the file menu.
     *
     * @event anEvent
     */
    @Event()
    public beforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers format dropdown items gets selected.
     *
     * @event anEvent
     * @hidden
     */
    @Event()
    public selectFormat: EmitType<SelectEventArgs>;

    /**
     * Triggers while clicking the ribbon content elements.
     *
     * @event anEvent
     */
    @Event()
    public clicked: EmitType<ClickEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event anEvent
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event anEvent
     */
    @Event()
    public expandCollapse: EmitType<ExpandCollapseEventArgs>;

    /**
     * Constructor for creating the widget.
     *
     * @param {RibbonModel} options - Specify the options
     * @param {string|HTMLDivElement} element -specify the element.
     */
    constructor(options?: RibbonModel, element?: string | HTMLDivElement) {
        super(options);
    }

    /**
     * For internal use only.
     *
     * @returns {void} - For internal use only.
     * @private
     */
    protected preRender(): void {
        /** */
    }

    /**
     * For internal use only.
     *
     * @returns {void} - For internal use only.
     * @private
     */
    protected render(): void {
        if (!this.element.id) { this.element.id = getUniqueID('ribbon'); }
        this.renderRibbon();
    }

    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     *
     * {% codeBlock src='spreadsheet/destroy/index.md' %}{% endcodeBlock %}
     *
     * @function destroy
     * @returns {void} - Destroys the component
     */
    public destroy(): void {
        const expandCollapseElem: HTMLElement = this.element.querySelector('.e-drop-icon');
        if (expandCollapseElem) {
            expandCollapseElem.removeEventListener('click', this.ribbonExpandCollapse.bind(this));
        }
        if (this.menuItems.length) {
            const fileMenu: HTMLElement = document.getElementById(`${this.element.id}_menu`);
            if (fileMenu) { (getComponent(fileMenu, 'menu') as Menu).destroy(); }
        }
        this.toolbarObj.destroy();
        this.tabObj.destroy();
        this.element.innerHTML = '';
        this.toolbarObj = null; this.tabObj = null;
        super.destroy();
    }

    private getTabItems(): TabItemModel[] {
        const tabItems: TabItemModel[] = [];
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
        const menu: HTMLElement = this.createElement('ul', { id: `${this.element.id}_menu` });
        this.element.appendChild(menu);
        const menuObj: Menu = new Menu({
            cssClass: 'e-file-menu',
            items: menuItems,
            showItemOnClick: true,
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.parentItem.text === menuItems[0].text) { menuObj.showItemOnClick = false; }
                this.trigger('beforeOpen', args);
            },
            select: (args: MenuEventArgs): void => {
                this.trigger('fileMenuItemSelect', args);
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
                this.trigger('beforeFileMenuItemRender', args);
            }
        });
        menuObj.createElement = this.createElement;
        menuObj.appendTo(menu);
        return menu.parentElement;
    }

    private renderRibbon(): void {
        const tabElement: HTMLElement = this.createElement('div');
        const tBarElement: HTMLElement = this.createElement('div');
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
                    if (args.selectingIndex === this.getIndex(this.selectedTab)) { return; }
                    this.updateToolbar(this.getIndex(args.selectingIndex, true));
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
                if (args.selectedIndex === this.getIndex(this.selectedTab)) { return; }
                this.setProperties({ 'selectedTab': this.getIndex(args.selectedIndex, true) }, true);
                if (this.element.classList.contains('e-collapsed')) {
                    this.element.classList.remove('e-collapsed');
                    this.trigger('expandCollapse', { element: this.toolbarObj.element, expanded: true });
                }
            },
            created: (): void => {
                this.toolbarObj.refreshOverflow();
            }
        });
        this.element.appendChild(tabElement);
        this.tabObj.createElement = this.createElement;
        this.tabObj.appendTo(tabElement);
        const collapseBtn: Element = this.createElement('span', { className: 'e-drop-icon e-icons' });
        collapseBtn.addEventListener('click', this.ribbonExpandCollapse.bind(this));
        this.element.appendChild(collapseBtn);
    }

    private ribbonExpandCollapse(e: MouseEvent): void {
        const eventArgs: ExpandCollapseEventArgs = { element: this.toolbarObj.element, expanded: true };
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

    private updateToolbar(index: number): void {
        this.toolbarObj.items = this.items[index].content; this.toolbarObj.dataBind();
    }

    /**
     * To enable / disable the ribbon menu items.
     *
     * @param {string[]} items - Items that needs to be enabled / disabled.
     * @param {boolean} enable - Set `true` / `false` to enable / disable the menu items.
     * @param {boolean} isUniqueId - Set `true` if the given menu items `text` is a unique id.
     * @returns {void} - To enable / disable the ribbon menu items.
     */
    public enableMenuItems(items: string[], enable: boolean = true, isUniqueId?: boolean): void {
        if (!this.menuItems.length) { return; }
        (getComponent(document.getElementById(`${this.element.id}_menu`), 'menu') as Menu).enableItems(items, enable, isUniqueId);
    }

    /**
     * To show/hide the menu items in Ribbon.
     *
     * @param {string[]} items - Specifies the menu items text which is to be show/hide.
     * @param {boolean} hide - Set `true` / `false` to hide / show the menu items.
     * @param {boolean} isUniqueId - Set `true` if the given menu items `text` is a unique id.
     * @returns {void} - To show/hide the menu items in Ribbon.
     */
    public hideMenuItems(items: string[], hide: boolean = true, isUniqueId?: boolean): void {
        if (!this.menuItems.length) { return; }
        const menuInstance: Menu = getComponent(document.getElementById(`${this.element.id}_menu`), 'menu') as Menu;
        if (hide) {
            menuInstance.hideItems(items, isUniqueId);
        } else {
            menuInstance.showItems(items, isUniqueId);
        }
    }

    /**
     * To add custom menu items.
     *
     * @param {MenuItemModel[]} items - Specifies the Ribbon menu items to be inserted.
     * @param {string} text - Specifies the existing file menu item text before / after which the new file menu items to be inserted.
     * @param {boolean} insertAfter - Set `false` if the `items` need to be inserted before the `text`.
     * By default, `items` are added after the `text`.
     * @param {boolean} isUniqueId - Set `true` if the given menu items `text` is a unique id.
     * @returns {void} - To add custom menu items.
     */
    public addMenuItems(items: MenuItemModel[], text: string, insertAfter: boolean = true, isUniqueId?: boolean): void {
        if (!this.menuItems.length) { return; }
        const menuInstance: Menu = getComponent(document.getElementById(`${this.element.id}_menu`), 'menu') as Menu;
        if (insertAfter) {
            menuInstance.insertAfter(items.reverse(), text, isUniqueId);
        } else {
            menuInstance.insertBefore(items, text, isUniqueId);
        }
    }

    /**
     * To show/hide the Ribbon tabs.
     *
     * @param {string[]} tabs - Specifies the tab header text which needs to be shown/hidden.
     * @param {boolean} hide - Set `true` / `false` to hide / show the ribbon tabs.
     * @returns {void} - To show/hide the Ribbon tabs.
     */
    public hideTabs(tabs: string[], hide: boolean = true): void {
        let idx: number; let activeTab: boolean; let stateChanged: boolean; let isAllHidden: boolean;
        if (!hide) { isAllHidden = this.isAllHidden(); }
        tabs.forEach((tab: string): void => {
            idx = this.getTabIndex(tab, -1);
            if (idx > -1) {
                if (hide) {
                    if (!this.items[idx].cssClass.includes(' e-hide')) {
                        this.items[idx].cssClass = `${this.items[idx].cssClass} e-hide`;
                        this.tabObj.items[this.getIndex(idx)].cssClass = this.items[idx].cssClass;
                        if (activeTab === undefined && idx === this.selectedTab) { activeTab = true; }
                        stateChanged = true;
                    }
                } else {
                    if (this.items[idx].cssClass.includes(' e-hide')) {
                        this.items[idx].cssClass = this.items[idx].cssClass.replace(' e-hide', '');
                        this.tabObj.items[this.getIndex(idx)].cssClass = this.items[idx].cssClass;
                        if (activeTab === undefined && idx === this.selectedTab) { activeTab = true; }
                        stateChanged = true;
                    }
                }
            }
        });
        this.setProperties({ 'items': this.items }, true);
        // eslint-disable-next-line no-self-assign
        this.tabObj.items = this.tabObj.items;
        this.tabObj.dataBind();
        if (hide) { isAllHidden = this.isAllHidden(); if (isAllHidden) { activeTab = false; } }
        if (!hide && isAllHidden) { activeTab = activeTab ? false : true; }
        if (stateChanged && isAllHidden) {
            if (this.element.classList.contains('e-collapsed')) {
                this.element.classList.remove('e-collapsed'); this.element.querySelector('.e-drop-icon').classList.remove('e-hide');
            } else {
                this.element.classList.add('e-collapsed'); this.element.querySelector('.e-drop-icon').classList.add('e-hide');
            }
        }
        if (activeTab) {
            for (let i: number = 0; i < this.items.length; i++) {
                if (!this.items[i].cssClass.includes(' e-hide')) {
                    this.tabObj.selectedItem = this.getIndex(i); this.tabObj.dataBind(); break;
                }
            }
        }
    }

    private isAllHidden(): boolean {
        let allHidden: boolean = true;
        for (let i: number = 0; i < this.items.length; i++) {
            if (!this.items[i].cssClass.includes(' e-hide')) { allHidden = false; break; }
        }
        return allHidden;
    }

    /**
     * To enable / disable the Ribbon tabs.
     *
     * @param {string[]} tabs - Specifies the tab header text which needs to be enabled / disabled.
     * @param {boolean} enable - Set `true` / `false` to enable / disable the ribbon tabs.
     * @returns {void} - To enable / disable the Ribbon tabs.
     */
    public enableTabs(tabs: string[], enable: boolean = true): void {
        tabs.forEach((tab: string): void => {
            let idx: number = (this.getTabIndex(tab, -1));
            if (idx > -1) {
                this.items[idx].disabled = !enable; idx = this.getIndex(idx); this.tabObj.enableTab(idx, enable);
            }
        });
        this.setProperties({ 'items': this.items }, true);
    }

    /**
     * To add custom tabs.
     *
     * @param {RibbonItemModel[]} items - Specifies the Ribbon tab items to be inserted.
     * @param {string} insertBefore - Specifies the existing Ribbon header text before which the new tabs will be inserted.
     * If not specified, the new tabs will be inserted at the end.
     * @returns {void} - To add custom tabs.
     */
    public addTabs(items: RibbonItemModel[], insertBefore?: string): void {
        let idx: number = this.getTabIndex(insertBefore);
        items.forEach((item: RibbonItemModel): void => {
            item = new RibbonItem(<RibbonItem>this.items[0], 'items', item, true); this.items.splice(idx, 0, item);
            this.tabObj.addTab([{ header: item.header, content: this.toolbarObj.element }], this.getIndex(idx));
            idx++;
        });
        this.setProperties({ 'items': this.items }, true);
        this.setProperties({ 'selectedTab': this.getIndex(this.tabObj.selectedItem, true) }, true);
    }

    private getTabIndex(headerText: string, idx: number = this.items.length): number {
        if (headerText) {
            for (let i: number = 0; i < this.items.length; i++) {
                if (this.items[i].header.text === headerText) { idx = i; break; }
            }
        }
        return idx;
    }

    /**
     * To add the custom items in Ribbon toolbar.
     *
     * @param {string} tab - Specifies the ribbon tab header text under which the specified items will be inserted..
     * @param {ItemModel[]} items - Specifies the ribbon toolbar items that needs to be inserted.
     * @param {number} index - Specifies the index text before which the new items will be inserted.
     * @returns {void} - To add the custom items in Ribbon toolbar.
     * If not specified, the new items will be inserted at the end of the toolbar.
     */
    public addToolbarItems(tab: string, items: ItemModel[], index?: number): void {
        const tabIdx: number = this.getTabIndex(tab);
        if (isNullOrUndefined(index)) { index = this.items[tabIdx].content.length; }
        items.forEach((item: ItemModel): void => {
            item = new Item(<Item>this.items[tabIdx].content[0], 'content', item, true);
            this.items[tabIdx].content.splice(index, 0, item); index++;
        });
        this.setProperties({ 'items': this.items }, true);
        if (tabIdx === this.selectedTab && items.length) { this.updateToolbar(tabIdx); }
    }

    /**
     * Enables or disables the specified Ribbon toolbar items or all ribbon items.
     *
     * @param {string} tab - Specifies the ribbon tab header text under which the toolbar items need to be enabled / disabled.
     * @param {number[]} items - Specifies the toolbar item indexes / unique id's which needs to be enabled / disabled.
     * If it is not specified the entire toolbar items will be enabled / disabled.
     * @param  {boolean} enable - Boolean value that determines whether the toolbar items should be enabled or disabled.
     * @returns {void} - Enables or disables the specified Ribbon toolbar items or all ribbon items.
     */
    public enableItems(tab: string, items?: number[] | string[], enable?: boolean): void {
        if (enable === undefined) { enable = true; }
        if (items) {
            const tabIdx: number = this.getTabIndex(tab, -1);
            if (tabIdx < 0) { return; }
            for (let i: number = 0; i < items.length; i++) {
                if (typeof items[i] === 'string') {
                    for (let j: number = 0; j < this.items[tabIdx].content.length; j++) {
                        if (this.items[tabIdx].content[j].id === items[i]) { items[i] = j; break; }
                    }
                }
                if (typeof items[i] === 'string') {
                    if (items.length - 1 > i) { continue; } else { return; }
                }
                this.items[tabIdx].content[items[i]].disabled = !enable;
                this.setProperties({ 'items': this.items }, true);
                if (tabIdx === this.selectedTab) {
                    this.toolbarObj.enableItems(<number>items[i], enable);
                }
            }
        }
        else {
            this.toolbarObj.disable(!enable);
        }
    }

    /**
     * To show/hide the existing Ribbon toolbar items.
     *
     * @param {string} tab - Specifies the ribbon tab header text under which the specified items need to be hidden / shown.
     * @param {number[]} indexes - Specifies the toolbar indexes which needs to be shown/hidden from UI.
     * @param {boolean} hide - Set `true` / `false` to hide / show the toolbar items.
     * @returns {void} - To show/hide the existing Ribbon toolbar items.
     */
    public hideToolbarItems(tab: string, indexes: number[], hide: boolean = true): void {
        let tabIdx: number;
        for (let i: number = 0; i < this.items.length; i++) {
            if (this.items[i].header.text === tab) {
                tabIdx = i;
                indexes.forEach((idx: number): void => {
                    if (this.items[tabIdx].content[idx]) {
                        if (hide) {
                            if (!this.items[tabIdx].content[idx].cssClass.includes(' e-hide')) {
                                this.items[tabIdx].content[idx].cssClass = this.items[tabIdx].content[idx].cssClass + ' e-hide';
                            }
                        } else {
                            if (this.items[tabIdx].content[idx].cssClass.includes(' e-hide')) {
                                this.items[tabIdx].content[idx].cssClass = this.items[tabIdx].content[idx].cssClass.replace(' e-hide', '');
                            }
                        }
                    }
                });
                break;
            }
        }
        this.setProperties({ 'items': this.items }, true);
        if (tabIdx !== undefined && tabIdx === this.selectedTab) { this.updateToolbar(tabIdx); }
    }

    /**
     * Get component name.
     *
     * @returns {string} - Get component name.
     * @private
     */
    public getModuleName(): string {
        return 'ribbon';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Get the properties to be maintained in the persisted state.
     * @private
     */
    public getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {RibbonModel} newProp - Specify the new properties
     * @param {RibbonModel} oldProp - specify the old properties.
     * @returns {void} - if any of the property value changed.
     * @private
     */
    public onPropertyChanged(newProp: RibbonModel, oldProp: RibbonModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'selectedTab':
                this.tabObj.selectedItem = this.getIndex(newProp.selectedTab); this.tabObj.dataBind();
                break;
            }
        }
    }
}
