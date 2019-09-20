import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, Event, EmitType, ChildProperty } from '@syncfusion/ej2-base';
import { getComponent, closest, EventHandler } from '@syncfusion/ej2-base';
import { Collection, Complex } from '@syncfusion/ej2-base';
import { Tab, Toolbar, ItemModel, SelectingEventArgs, MenuItemModel, ClickEventArgs, TabItemModel } from '@syncfusion/ej2-navigations';
import { Menu, MenuEventArgs, BeforeOpenCloseMenuEventArgs, HeaderModel, Header, Item, MenuItem } from '@syncfusion/ej2-navigations';
import { RibbonModel, RibbonItemModel } from './ribbon-model';
import { SelectEventArgs } from '@syncfusion/ej2-dropdowns';

export type RibbonItemType = 'Tab' | 'Menu' | 'Sidebar';

/**
 * An array of object that is used to configure the Tab.
 */
export class RibbonItem extends ChildProperty<RibbonItem> {
    /**
     * The object used for configuring the Tab item header properties.
     * @default {}
     */
    @Complex<HeaderModel>({}, Header)
    public header: HeaderModel;
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
    /**
     * Sets true to disable user interactions of the Tab item.
     * @default 'Tab'
     */
    @Property('Tab')
    public type: RibbonItemType;
    /**
     * Specifies the sub menu items that is the array of MenuItem model.
     * @default []
     */
    @Collection<MenuItemModel>([], MenuItem)
    public menuItems: MenuItemModel[];
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
     * An array of object that is used to configure the Tab component.
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
        this.renderRibbon();
    }

    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.destroyComponent(this.element.querySelector('.e-file-menu'), Menu);
        let expandCollapseElem: HTMLElement = this.tabObj.element.querySelector('.e-drop-icon');
        if (expandCollapseElem) {
            expandCollapseElem.removeEventListener('click', this.ribbonExpandCollapse.bind(this));
        }
        this.toolbarObj.destroy();
        this.tabObj.destroy();
        super.destroy();
    }

    private getTabItems(): TabItemModel[] {
        let tabItems: TabItemModel[] = [];
        this.items.forEach((item: RibbonItem): void => {
            switch (item.type) {
                case 'Menu':
                    tabItems.push({
                        header: { text: this.initMenu(item.menuItems) },
                        content: this.toolbarObj.element
                    });
                    break;
                case 'Tab':
                    tabItems.push({
                        header: item.header,
                        content: this.toolbarObj.element
                    });
                    break;
            }
        });
        return tabItems;
    }

    private initMenu(menuItems: MenuItemModel[]): HTMLElement {
        let menu: HTMLElement = this.createElement('ul');
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
            clicked: (args: ClickEventArgs): void => {
                this.trigger('clicked', args);
            }
        });
        this.toolbarObj.createElement = this.createElement;
        this.toolbarObj.appendTo(tBarElement);
        this.tabObj = new Tab({
            selectedItem: 1,
            animation: { next: { duration: 0 }, previous: { duration: 0 } },
            items: this.getTabItems(),
            selecting: (args: SelectingEventArgs): void => {
                if (this.items[args.selectingIndex].type === 'Menu') {
                    args.cancel = true;
                } else {
                    this.toolbarObj.items = this.items[args.selectingIndex].content;
                    this.toolbarObj.dataBind();
                    if (this.element.classList.contains('e-collapsed')) {
                        EventHandler.remove(
                            this.tabObj.element.querySelector('.e-tab-header .e-toolbar-item.e-active'),
                            'click', this.ribbonExpandCollapse);
                    }
                }
                this.trigger('selecting', args);
            },
            selected: (): void => {
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
        let activeTab: Element = this.tabObj.element.querySelector('.e-tab-header .e-toolbar-item.e-active');
        if (this.element.classList.contains('e-collapsed')) {
            this.element.classList.remove('e-collapsed');
            EventHandler.remove(activeTab, 'click', this.ribbonExpandCollapse);
            this.trigger('expandCollapse', eventArgs);
        } else {
            this.element.classList.add('e-collapsed'); eventArgs.expanded = false;
            EventHandler.add(activeTab, 'click', this.ribbonExpandCollapse, this);
            this.trigger('expandCollapse', eventArgs);
        }
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
        /** code snippets */
    }

    private destroyComponent(element: HTMLElement, component: Object): void {
        if (element) {
            let compObj: Object = getComponent(element, component);
            if (compObj) {
                (<{ destroy: Function }>compObj).destroy();
            }
        }
    }
}