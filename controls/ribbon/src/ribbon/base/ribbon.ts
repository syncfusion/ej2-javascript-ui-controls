import { addClass, append, Event, Collection, Complex, Component, EmitType, EventHandler, formatUnit, getInstance, getComponent, getUniqueID, closest } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, isNullOrUndefined, isUndefined, ModuleDeclaration, NotifyPropertyChanges, Property, remove, removeClass } from '@syncfusion/ej2-base';
import { Tab, TabAnimationSettings, TabAnimationSettingsModel, TabItemModel, SelectEventArgs, SelectingEventArgs, HScroll, Toolbar } from '@syncfusion/ej2-navigations';
import { RibbonTab, RibbonTabModel, RibbonGroupModel, RibbonCollectionModel, RibbonItemModel, FileMenuSettings, FileMenuSettingsModel, RibbonItem, RibbonCollection, RibbonGroup } from '../models/index';
import { RibbonModel } from './ribbon-model';
import { commonProperties, DisplayMode, ExpandCollapseEventArgs, itemProps, LauncherClickEventArgs, ribbonItemPropsList, RibbonLayout, ribbonTooltipData, TabSelectedEventArgs, TabSelectingEventArgs } from './interface';
import { ItemOrientation, RibbonItemSize, RibbonItemType } from './interface';
import { RibbonButton, RibbonComboBox, RibbonCheckBox, RibbonDropDown, RibbonColorPicker, RibbonSplitButton } from '../items/index';
import { destroyControl, getCollection, getGroup, getIndex, getItem, getItemElement, updateCommonProperty, updateControlDisabled, isTooltipPresent, getTemplateFunction, createTooltip, destroyTooltip, updateTooltipProp } from './utils';
import * as constants from './constant';
import { RibbonFileMenu } from '../modules/index';
import { RibbonTooltipModel } from '../models/ribbon-tooltip-model';
import { Popup } from '@syncfusion/ej2-popups';
import { BeforeOpenCloseMenuEventArgs, DropDownButton, SplitButton } from '@syncfusion/ej2-splitbuttons';

/**
 * The Ribbon Component is a structured layout to manage tools with tabs and groups.
 */
@NotifyPropertyChanges
export class Ribbon extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Specifies the active layout of the ribbon.
     * Accepts one of the below values.
     * * Classic – Renders the ribbon tab contents in classic layout.
     * * Simplified – Renders the ribbon tab contents in single row.
     *
     * @isenumeration true
     * @default RibbonLayout.Classic
     * @asptype RibbonLayout
     */
    @Property('Classic')
    public activeLayout: RibbonLayout | string;

    /**
     * Defines one or more CSS classes to customize the appearance of ribbon.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines the properties of ribbon file menu.
     *
     * @default {}
     */
    @Complex<FileMenuSettingsModel>({}, FileMenuSettings)
    public fileMenu: FileMenuSettingsModel;

    /**
     * Defines the icon CSS for the launcher icon button in group header.
     *
     * @default ''
     */
    @Property('')
    public launcherIconCss: string;

    /**
     * Specifies whether the ribbon is minimized or not.
     * When minimized, only the tab header is shown.
     *
     * @default false
     */
    @Property(false)
    public isMinimized: boolean;

    /**
     * Provides the localization value for the controls present in ribbon items.
     *
     * @default 'en-us'
     */
    @Property('en-us')
    public locale: string;

    /**
     * Specifies the index of the current active tab.
     *
     * @default 0
     */
    @Property(0)
    public selectedTab: number;

    /**
     * Specifies the animation configuration settings for showing the content of the Ribbon Tab.
     *
     * @default { previous: { effect: 'SlideLeftIn', duration: 600, easing: 'ease' },next: { effect: 'SlideRightIn', duration: 600, easing: 'ease' } }
     */
    @Complex<TabAnimationSettingsModel>({}, TabAnimationSettings)
    public tabAnimation: TabAnimationSettingsModel;

    /**
     * Defines the list of ribbon tabs.
     *
     * @default []
     */
    @Collection<RibbonTabModel>([], RibbonTab)
    public tabs: RibbonTabModel[];

    /**
     * Specifies the width of the ribbon.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Specifies the template content for the help pane of ribbon.
     * The help pane appears on the right side of the ribbon header row.
     *
     * @default ''
     * @aspType string
     */
    @Property('')
    public helpPaneTemplate: string | HTMLElement;

    /**
     * Event triggers before selecting the tab item.
     *
     * @event tabSelecting
     */
    @Event()
    public tabSelecting: EmitType<TabSelectingEventArgs>;

    /**
     * Event triggers after selecting the tab item.
     *
     * @event tabSelected
     */
    @Event()
    public tabSelected: EmitType<TabSelectedEventArgs>;

    /**
     * Event triggers before expanding the ribbon.
     *
     * @event ribbonExpanding
     */
    @Event()
    public ribbonExpanding: EmitType<ExpandCollapseEventArgs>;

    /**
     * Event triggers before collapsing the ribbon.
     *
     * @event ribbonCollapsing
     */
    @Event()
    public ribbonCollapsing: EmitType<ExpandCollapseEventArgs>;

    /**
     * Event triggers when the launcher icon of the group is clicked.
     *
     * @event launcherIconClick
     */
    @Event()
    public launcherIconClick: EmitType<LauncherClickEventArgs>;

    /**
     * The `ribbonButtonModule` is used to create and manipulate buttons in ribbon item.
     */
    public ribbonButtonModule: RibbonButton;

    /**
     * The `ribbonDropDownModule` is used to create and manipulate dropdown buttons in ribbon item.
     */
    public ribbonDropDownModule: RibbonDropDown;

    /**
     * The `ribbonSplitButtonModule` is used to create and manipulate split buttons in ribbon item.
     */
    public ribbonSplitButtonModule: RibbonSplitButton;

    /**
     * The `ribbonCheckBoxModule` is used to create and manipulate checkbox in ribbon item.
     */
    public ribbonCheckBoxModule: RibbonCheckBox;

    /**
     * The `ribbonColorPickerModule` is used to create and manipulate color picker in ribbon item.
     */
    public ribbonColorPickerModule: RibbonColorPicker;

    /**
     * The `ribbonComboBoxModule` is used to create and manipulate combobox in ribbon item.
     */
    public ribbonComboBoxModule: RibbonComboBox;

    /**
     * The `ribbonFileMenuModule` is used to create and manipulate the ribbon file menu.
     */
    public ribbonFileMenuModule: RibbonFileMenu;


    private idIndex: number;
    private isAddRemove: boolean;
    private collapseButton: HTMLElement;
    private ribbonTempEle: HTMLElement;
    private scrollModule: HScroll;
    /** @hidden */
    public overflowDDB: DropDownButton;
    /** @hidden */
    public tabsInternal: RibbonTabModel[];
    /** @hidden */
    public tabObj: Tab;
    /** @hidden */
    public tooltipData: ribbonTooltipData[];

    /**
     * Constructor for creating the widget.
     *
     * @param  {RibbonModel} options - Specifies the ribbon model
     * @param  {string|HTMLDivElement} element - Specifies the target element
     */
    constructor(options?: RibbonModel, element?: string | HTMLElement) {
        Ribbon.Inject(RibbonButton, RibbonCheckBox, RibbonDropDown, RibbonSplitButton, RibbonComboBox);
        super(options, <string | HTMLElement>element);
    }

    /**
     * Initialize the control rendering.
     *
     * @returns {void}
     * @private
     */
    protected render(): void {
        this.initialize();
    }

    protected preRender(): void {
        this.idIndex = 0;
        this.tooltipData = [];
        this.isAddRemove = false;
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist data
     */
    protected getPersistData(): string {
        return this.addOnPersist(['activeLayout']);
    }

    /**
     * Get component name.
     *
     * @returns {string} - Module name
     * @private
     */
    protected getModuleName(): string {
        return 'ribbon';
    }

    /**
     * To provide the array of modules needed for component rendering
     *
     * @returns {ModuleDeclaration[]} - returns module declaration.
     * @hidden
     */
    protected requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        modules.push(
            { member: 'ribbonButton', args: [this] },
            { member: 'ribbonDropDown', args: [this] },
            { member: 'ribbonSplitButton', args: [this] },
            { member: 'ribbonCheckBox', args: [this] },
            { member: 'ribbonColorPicker', args: [this] },
            { member: 'ribbonComboBox', args: [this] },
            { member: 'ribbonFileMenu', args: [this] });
        return modules;
    }

    private initialize(): void {
        this.element.id = this.element.id || getUniqueID('e-' + this.getModuleName());
        addClass([this.element], ['e-rbn', ...(this.cssClass ? this.cssClass.split(constants.SPACE) : [])]);
        if (this.enableRtl) { this.element.classList.add(constants.RTL_CSS); }
        this.element.style.width = formatUnit(this.width);
        this.renderTabs();
        if (this.ribbonFileMenuModule) { this.ribbonFileMenuModule.createFileMenu(this.fileMenu); }
        this.createHelpPaneTemplate();
        createTooltip(this.element, this);
        this.wireEvents();
    }

    private wireEvents(): void {
        EventHandler.add(<HTMLElement & Window><unknown>window, 'resize', this.resizeHandler, this);
    }

    private resizeHandler(): void {
        const activeContent: HTMLElement = this.tabObj.element.querySelector('#' + this.tabs[this.selectedTab].id + constants.CONTENT_ID);
        this.checkOverflow(this.selectedTab, activeContent);
        if (this.scrollModule) {
            const scrollEle: HTMLElement = this.tabObj.element.querySelector('.' + constants.HORIZONTAL_SCROLLBAR);
            this.scrollModule.scrollStep = scrollEle.offsetWidth;
        }
    }

    private renderTabs(): void {
        this.tabsInternal = this.tabs.slice();
        this.tabsInternal = this.checkID(this.tabsInternal, 'tab', this.element.id);
        this.setProperties({ tabs: this.tabsInternal }, true);
        const tabEle: HTMLElement = this.createElement('div', {
            id: this.element.id + constants.TAB_ID
        });
        this.element.appendChild(tabEle);
        this.validateItemSize();
        const tabItems: TabItemModel[] = this.createTabItems(this.tabs);
        this.tabObj = new Tab({
            cssClass: constants.RIBBON_TAB,
            selectedItem: this.selectedTab,
            overflowMode: 'Popup',
            width: this.width,
            items: tabItems,
            enableRtl: this.enableRtl,
            created: this.tabCreated.bind(this),
            selected: this.ribbonTabSelected.bind(this),
            selecting: this.ribbonTabSelecting.bind(this)
        });
        this.tabObj.appendTo(tabEle);
        //Set the width value as "0px" with unit for proper calculation.
        this.element.style.setProperty(constants.RIBBON_FILE_MENU_WIDTH, '0px');
        this.element.style.setProperty(constants.RIBBON_HELP_PANE_TEMPLATE_WIDTH, '0px');
        const toolbarEle: HTMLElement = tabEle.querySelector('.e-toolbar');
        const toolbar: Toolbar = getComponent(toolbarEle, Toolbar);
        toolbar.setProperties({ width: 'calc(100% - var(--fileMenuWidth) - var(--helpTemplateWidth))' });
        this.element.classList[this.isMinimized ? 'add' : 'remove'](constants.RIBBON_MINIMIZE);
    }

    private minimize(val: boolean): void {
        if (val === this.isMinimized) { return; }
        const eventArgs: ExpandCollapseEventArgs = { cancel: false };
        this.trigger(val ? 'ribbonCollapsing' : 'ribbonExpanding', eventArgs, (args: ExpandCollapseEventArgs) => {
            if (args.cancel) { return; }
            this.setProperties({ isMinimized: val }, true);
            this.element.classList.toggle(constants.RIBBON_MINIMIZE, this.isMinimized);
            //to overwrite inline styles from hscroll
            (this.tabObj.element.querySelector('.e-content') as HTMLElement).style.display = val ? 'none' : 'block';
            if (!val) { this.refreshLayout(); }
        });
    }

    private toggleLayout(): void {
        this.setProperties({ activeLayout: this.activeLayout === 'Simplified' ? 'Classic' : 'Simplified' }, true);
        this.switchLayout();
    }

    private tabCreated(): void {
        this.addExpandCollapse();
        this.renderInitialTab(this.selectedTab);
    }

    private ribbonTabSelected(e: SelectEventArgs): void {
        this.isAddRemove = false;
        const selectedTabId: string = e.selectedItem.getAttribute('data-id');
        let selectedIndex: number = getIndex<RibbonTabModel>(this.tabs, ((tab: RibbonTabModel) => (tab.id === selectedTabId)));
        selectedIndex = selectedIndex === -1 ? this.selectedTab : selectedIndex;
        const eventArgs: TabSelectedEventArgs = { previousIndex: this.selectedTab, selectedIndex: selectedIndex };
        this.setProperties({ selectedTab: selectedIndex }, true);
        this.checkOverflow(selectedIndex, e.selectedContent.firstChild as HTMLElement);
        if (this.activeLayout === 'Simplified' && this.overflowDDB) {
            const overflowTarget: HTMLElement = this.overflowDDB.target as HTMLElement;
            const ofTabContainer: HTMLElement = overflowTarget.querySelector('.' + constants.RIBBON_TAB_ACTIVE);
            if (ofTabContainer) { ofTabContainer.classList.remove(constants.RIBBON_TAB_ACTIVE); }
            const activeTab: HTMLElement = overflowTarget.querySelector('#' + selectedTabId + constants.OVERFLOW_ID);
            if (activeTab) {
                activeTab.classList.add(constants.RIBBON_TAB_ACTIVE);
                this.overflowDDB.element.classList.remove(constants.HIDE_CSS);
            }
            else { this.overflowDDB.element.classList.add(constants.HIDE_CSS); }
        }
        this.trigger('tabSelected', eventArgs);
    }

    private checkOverflow(tabIndex: number, activeContent: HTMLElement): void {
        const tabContent: HTMLElement = activeContent.closest('.' + constants.TAB_CONTENT) as HTMLElement;
        const isOverFlow: boolean = tabContent.offsetWidth < activeContent.offsetWidth;
        if (isOverFlow && !this.scrollModule) {
            if (this.activeLayout === 'Classic') {
                // Defines whether the shrinking is breaked due to insufficient space.
                let isBreak: boolean = false;
                isBreak = this.checkGroupShrinking(tabIndex, tabContent, activeContent, true);
                if (!isBreak && (tabContent.offsetWidth < activeContent.offsetWidth)) {
                    isBreak = this.checkGroupShrinking(tabIndex, tabContent, activeContent, false);
                }
                if (tabContent.offsetWidth < activeContent.offsetWidth) {
                    this.createOverflowDropdown(tabIndex, tabContent, activeContent);
                }
            }
            else {
                this.checkSimplifiedItemShrinking(tabIndex, tabContent, activeContent);
                if (tabContent.offsetWidth < activeContent.offsetWidth) {
                    this.createSimplfiedOverflow(tabContent, activeContent, tabIndex);
                }
            }
            //Adds Scroll if the tabwidth is less the content width even after adding overflow dropdown.
            if ((tabContent.offsetWidth < activeContent.offsetWidth) && (!this.scrollModule)) {
                this.scrollModule = new HScroll({
                    enableRtl: this.enableRtl
                }, this.tabObj.element.querySelector('.' + constants.TAB_CONTENT) as HTMLElement);
            }
        } else if (!isOverFlow) {
            this.destroyScroll();
            if (this.activeLayout === 'Classic') {
                let isBreak: boolean = false;
                isBreak = this.removeOverflowDropdown(tabContent, activeContent, false, tabIndex);
                //Check for expanding small items to medium items.
                if (!isBreak && (tabContent.offsetWidth > activeContent.offsetWidth)) {
                    isBreak = this.checkGroupExpanding(tabIndex, tabContent, activeContent, true);
                }
                //Check for expanding medium items to large items.
                if (!isBreak && (tabContent.offsetWidth > activeContent.offsetWidth)) {
                    isBreak = this.checkGroupExpanding(tabIndex, tabContent, activeContent, false);
                }
            }
            else {
                this.removeSimplfiedOverflow(tabContent, activeContent, tabIndex);
                if (tabContent.offsetWidth > activeContent.offsetWidth) {
                    this.checkSimplifiedItemExpanding(tabIndex, tabContent, activeContent);
                }
            }
        }
    }

    private checkSimplifiedItemShrinking(tabIndex: number, tabContent: HTMLElement, activeContent: HTMLElement): void {
        const tab: RibbonTabModel = this.tabs[parseInt(tabIndex.toString(), 10)];
        for (let i: number = (tab.groups.length - 1); (i >= 0); i--) {
            const group: RibbonGroupModel = tab.groups[parseInt(i.toString(), 10)];
            const groupContainer: HTMLElement = tabContent.querySelector('#' + group.id + constants.CONTAINER_ID);
            for (let j: number = 0; ((j < group.collections.length) && (tabContent.offsetWidth < activeContent.offsetWidth)); j++) {
                const collection: RibbonCollectionModel = group.collections[parseInt(j.toString(), 10)];
                for (let k: number = collection.items.length; ((k >= 1) && (tabContent.offsetWidth < activeContent.offsetWidth)); k--) {
                    const item: RibbonItemModel = collection.items[k - 1];
                    if (((item.allowedSizes & RibbonItemSize.Small) && (item.allowedSizes & RibbonItemSize.Medium))
                        && (item.activeSize === RibbonItemSize.Medium) && (item.displayOptions & DisplayMode.Simplified)) {
                        const itemContainer: HTMLElement = groupContainer.querySelector('#' + item.id + constants.CONTAINER_ID);
                        if (itemContainer) {
                            const itemEle: HTMLElement = itemContainer.querySelector('#' + item.id);
                            itemContainer.setAttribute('data-medium-width', activeContent.offsetWidth.toString());
                            (item as RibbonItem).setProperties({ activeSize: RibbonItemSize.Small }, true);
                            this.setItemSize(itemEle, item);
                        }
                    }
                }
            }
        }
    }

    private checkSimplifiedItemExpanding(tabIndex: number, tabContent: HTMLElement, activeContent: HTMLElement): void {
        const tab: RibbonTabModel = this.tabs[parseInt(tabIndex.toString(), 10)];
        for (let i: number = (tab.groups.length - 1); (i >= 0); i--) {
            const group: RibbonGroupModel = tab.groups[parseInt(i.toString(), 10)];
            const groupContainer: HTMLElement = tabContent.querySelector('#' + group.id + constants.CONTAINER_ID);
            for (let j: number = 0; ((j < group.collections.length) && (tabContent.offsetWidth > activeContent.offsetWidth)); j++) {
                const collection: RibbonCollectionModel = group.collections[parseInt(j.toString(), 10)];
                for (let k: number = collection.items.length; ((k >= 1) && (tabContent.offsetWidth > activeContent.offsetWidth)); k--) {
                    const item: RibbonItemModel = collection.items[k - 1];
                    if (((item.allowedSizes & RibbonItemSize.Small) && (item.allowedSizes & RibbonItemSize.Medium))
                        && (item.activeSize === RibbonItemSize.Small) && (item.displayOptions & DisplayMode.Simplified)) {
                        const itemContainer: HTMLElement = groupContainer.querySelector('#' + item.id + constants.CONTAINER_ID);
                        if (itemContainer) {
                            const valString: string = itemContainer.getAttribute('data-medium-width');
                            const value: number = valString ? parseInt(valString, 10) : null;
                            if (value && (tabContent.offsetWidth > value)) {
                                itemContainer.removeAttribute('data-medium-width');
                                const itemEle: HTMLElement = itemContainer.querySelector('#' + item.id);
                                (item as RibbonItem).setProperties({ activeSize: RibbonItemSize.Medium }, true);
                                this.setItemSize(itemEle, item);
                            }
                        }
                    }
                }
            }
        }
    }

    private createSimplfiedOverflow(tabContent: HTMLElement, activeContent: HTMLElement, tabIndex: number): void {
        const orderedGroups: RibbonGroupModel[] = this.getGroupResizeOrder(true, tabIndex);
        for (let i: number = 0; ((i < orderedGroups.length) && (tabContent.offsetWidth < activeContent.offsetWidth)); i++) {
            const group: RibbonGroupModel = orderedGroups[parseInt(i.toString(), 10)];
            const groupEle: HTMLElement = tabContent.querySelector('#' + group.id);
            const groupContainer: HTMLElement = groupEle.querySelector('#' + group.id + constants.CONTAINER_ID);
            for (let j: number = group.collections.length; ((j >= 1) && (tabContent.offsetWidth < activeContent.offsetWidth)); j--) {
                const collection: RibbonCollectionModel = group.collections[parseInt((j - 1).toString(), 10)];
                const collectionEle: HTMLElement = groupEle.querySelector('#' + collection.id);
                for (let k: number = collection.items.length; ((k >= 1) && (tabContent.offsetWidth < activeContent.offsetWidth)); k--) {
                    const item: RibbonItemModel = collection.items[k - 1];
                    const itemContainer: HTMLElement = collectionEle.querySelector('#' + item.id + constants.CONTAINER_ID);
                    if ((item.displayOptions === (DisplayMode.Simplified | DisplayMode.Overflow)) && !isNullOrUndefined(itemContainer)) {
                        itemContainer.setAttribute('data-simplified-width', activeContent.offsetWidth.toString());
                        this.createOverflowPopup(item, tabIndex, group.enableGroupOverflow, group.id
                            , group.header, itemContainer, groupContainer);
                        if (item.activeSize === RibbonItemSize.Small) {
                            const itemEle: HTMLElement = itemContainer.querySelector('#' + item.id);
                            (item as RibbonItem).setProperties({ activeSize: RibbonItemSize.Medium }, true);
                            this.setItemSize(itemEle, item);
                        }
                        if ((item.type === RibbonItemType.DropDown) || (item.type === RibbonItemType.SplitButton)) {
                            this.updatePopupItems(item, itemContainer, group.enableGroupOverflow, true);
                        }
                    }
                }
            }
            if (!(group.enableGroupOverflow || groupEle.querySelector('.' + constants.RIBBON_ITEM))) {
                groupEle.classList.add('e-ribbon-emptyCollection');
            }
        }
    }

    private updatePopupItems(item: RibbonItemModel, itemEle: HTMLElement, isGroupOF: boolean, isMenu: boolean): void {
        const dropdown: DropDownButton | SplitButton = getComponent((itemEle.querySelector('#' + item.id) as HTMLElement), (item.type === RibbonItemType.DropDown) ? DropDownButton : SplitButton);
        const dropDownPopup: Popup = dropdown.dropDown;
        // popup is on right if (isGroupOF && isMenu)
        // The position is reversed if RTL is enabled.
        // isRight = ((isGroupOF && isMenu) && !this.enableRtl ) || (!(isGroupOF && isMenu) && this.enableRtl)  ==> (isGroupOF && isMenu) !== this.enableRtl
        const isLeft: boolean = (isGroupOF && isMenu) === this.enableRtl;
        dropDownPopup.setProperties({ position: { X: isLeft ? 'left' : 'right', Y: isMenu ? 'top' : 'bottom' } }, true);
        if (isMenu) {
            dropdown.beforeOpen = (): void => {
                if (isLeft) {
                    dropDownPopup.element.style.setProperty('visibility', 'hidden');
                    dropDownPopup.element.style.setProperty('display', 'block');
                    dropDownPopup.setProperties({ offsetX: -1 * dropDownPopup.element.offsetWidth });
                    dropDownPopup.element.style.removeProperty('display');
                    dropDownPopup.element.style.removeProperty('visibility');
                }
            };
        } else {
            dropDownPopup.setProperties({ offsetX: 0 }, true);
            dropdown.beforeOpen = null;
        }
    }

    private removeSimplfiedOverflow(tabContent: HTMLElement, activeContent: HTMLElement, tabIndex: number, isClear: boolean = false): void {
        const orderedGroups: RibbonGroupModel[] = this.getGroupResizeOrder(false, tabIndex);
        let flag: boolean = true;
        for (let i: number = 0; ((i < orderedGroups.length) && flag); i++) {
            const group: RibbonGroupModel = orderedGroups[parseInt(i.toString(), 10)];
            let overflowDDB: DropDownButton;
            let overflowtarget: HTMLElement;
            if (group.enableGroupOverflow) {
                const overflowDDBEle: HTMLElement = tabContent.querySelector('#' + group.id + constants.GROUPOF_BUTTON_ID);
                if (overflowDDBEle) {
                    overflowDDB = getInstance(overflowDDBEle, DropDownButton) as DropDownButton;
                    overflowtarget = overflowDDB.target as HTMLElement;
                }
            }
            else {
                overflowDDB = this.overflowDDB;
                overflowtarget = this.overflowDDB ? this.overflowDDB.target as HTMLElement : null;
            }
            for (let j: number = 0; ((j < group.collections.length) && flag); j++) {
                const collection: RibbonCollectionModel = group.collections[parseInt(j.toString(), 10)];
                // eslint-disable-next-line max-len
                for (let k: number = 0; ((k < collection.items.length) && flag && !isClear && (tabContent.offsetWidth > activeContent.offsetWidth)); k++) {
                    const item: RibbonItemModel = collection.items[parseInt(k.toString(), 10)];
                    let itemContainer: HTMLElement;
                    if (overflowtarget) {
                        itemContainer = overflowtarget.querySelector('#' + item.id + constants.CONTAINER_ID);
                    }
                    if ((item.displayOptions === (DisplayMode.Simplified | DisplayMode.Overflow)) && !isNullOrUndefined(itemContainer)) {
                        const width: number = parseInt(itemContainer.getAttribute('data-simplified-width'), 10);
                        if (!isClear && (tabContent.offsetWidth < width)) { flag = false; break; }
                        const groupEle: HTMLElement = tabContent.querySelector('#' + collection.id);
                        if ((item.type === RibbonItemType.DropDown) || (item.type === RibbonItemType.SplitButton)) {
                            this.updatePopupItems(item, itemContainer, group.enableGroupOverflow, false);
                        }
                        groupEle.append(itemContainer);
                        this.removeOverflowEvent(item, itemContainer);
                        if (item.allowedSizes & RibbonItemSize.Small) {
                            (item as RibbonItem).setProperties({ activeSize: RibbonItemSize.Small }, true);
                            this.setItemSize(itemContainer.querySelector('#' + item.id), item);
                        }
                    }
                }
            }
            const groupEle: HTMLElement = tabContent.querySelector('#' + group.id);
            const itemEle: HTMLElement = groupEle.querySelector('.' + constants.RIBBON_ITEM);
            if (groupEle.classList.contains('e-ribbon-emptyCollection') && itemEle !== null) {
                groupEle.classList.remove('e-ribbon-emptyCollection');
            }
            if (overflowDDB) {
                if (group.enableGroupOverflow) {
                    if (overflowtarget.childElementCount === 0) { this.removeOverflowButton(overflowDDB); }
                } else {
                    const ofGroupContainer: HTMLElement = overflowtarget.querySelector('#' + group.id + constants.CONTAINER_ID);
                    if (ofGroupContainer && ofGroupContainer.childElementCount === 1) { ofGroupContainer.remove(); }
                    const ofTabContainer: HTMLElement = overflowtarget.querySelector('#' + this.tabs[parseInt(tabIndex.toString(), 10)].id + constants.OVERFLOW_ID);
                    if (ofTabContainer && ofTabContainer.childElementCount === 0) {
                        ofTabContainer.remove();
                        this.overflowDDB.element.classList.add(constants.HIDE_CSS);
                    }
                }
            }
        }
        if (this.overflowDDB) {
            const overflowEle: HTMLElement = this.overflowDDB.target as HTMLElement;
            if (overflowEle.childElementCount === 0) {
                this.removeOverflowButton(this.overflowDDB);
                this.overflowDDB = null;
            }
        }
    }

    private createOverflowPopup(item: RibbonItemModel, tabIndex: number, isGroupOF: boolean, groupId: string, groupHeader: string
        , itemEle: HTMLElement, groupContainer: HTMLElement): void {
        let overflowButton: DropDownButton;
        if (isGroupOF) {
            const overflowDDB: HTMLElement = groupContainer.querySelector('#' + groupId + constants.GROUPOF_BUTTON_ID);
            if (!overflowDDB) {
                overflowButton = this.addOverflowButton(groupId + constants.GROUPOF_BUTTON_ID);
                overflowButton.element.classList.add(constants.RIBBON_GROUP_OF_BUTTON);
                groupContainer.appendChild(overflowButton.element);
            } else {
                overflowButton = getInstance(overflowDDB, DropDownButton) as DropDownButton;
            }
            (overflowButton.target as HTMLElement).append(itemEle);
        }
        else {
            if (!this.overflowDDB) {
                this.overflowDDB = this.addOverflowButton(this.tabObj.element.id + constants.OVRLOF_BUTTON_ID);
                this.tabObj.element.insertBefore(this.overflowDDB.element, this.collapseButton);
                this.overflowDDB.element.classList.add(constants.RIBBON_OVERALL_OF_BUTTON);
                this.createOfTabContainer(groupId, groupHeader, itemEle, tabIndex);
            }
            else {
                this.overflowDDB.element.classList.remove(constants.HIDE_CSS);
                const overflowEle: HTMLElement = this.overflowDDB.target as HTMLElement;
                const ofTabContainer: HTMLElement = overflowEle.querySelector('#' + this.tabs[parseInt(tabIndex.toString(), 10)].id + constants.OVERFLOW_ID);
                if (ofTabContainer) {
                    let ofGroupContainer: HTMLElement = overflowEle.querySelector('#' + groupId + constants.CONTAINER_ID);
                    if (!ofGroupContainer) {
                        ofGroupContainer = this.createGroupContainer(groupId, groupHeader);
                        ofTabContainer.append(ofGroupContainer);
                    }
                    ofGroupContainer.append(itemEle);
                }
                else {
                    this.createOfTabContainer(groupId, groupHeader, itemEle, tabIndex);
                }
            }
            overflowButton = this.overflowDDB;
        }
        this.addOverflowEvents(item, itemEle, overflowButton);
    }

    private addOverflowEvents(item: RibbonItemModel, itemEle: HTMLElement, overflowButton: DropDownButton): void {
        switch (item.type) {
        case 'Button':
            this.ribbonButtonModule.addOverFlowEvents(item, itemEle, overflowButton);
            break;
        case 'DropDown':
            this.ribbonDropDownModule.addOverFlowEvents(item, itemEle, overflowButton);
            break;
        case 'SplitButton':
            this.ribbonSplitButtonModule.addOverFlowEvents(item, itemEle, overflowButton);
            break;
        case 'CheckBox':
            this.ribbonCheckBoxModule.addOverFlowEvents(item, itemEle, overflowButton);
            break;
        case 'ColorPicker':
            this.ribbonColorPickerModule.addOverFlowEvents(item, itemEle, overflowButton);
            break;
        case 'ComboBox':
            this.ribbonComboBoxModule.addOverFlowEvents(item, itemEle, overflowButton);
            break;
        }
    }

    private createOfTabContainer(groupId: string, groupHeader: string, itemEle: HTMLElement, tabIndex: number): void {
        const ofTabContainer: HTMLElement = this.createElement('div', {
            id: this.tabs[parseInt(tabIndex.toString(), 10)].id + constants.OVERFLOW_ID,
            className: constants.RIBBON_OF_TAB_CONTAINER
        });
        const overflowtarget: HTMLElement = this.overflowDDB.target as HTMLElement;
        overflowtarget.append(ofTabContainer);
        const ofGroupContainer: HTMLElement = this.createGroupContainer(groupId, groupHeader);
        ofGroupContainer.append(itemEle);
        ofTabContainer.append(ofGroupContainer);
        if (tabIndex === this.selectedTab) { ofTabContainer.classList.add(constants.RIBBON_TAB_ACTIVE); }
    }

    private checkGroupShrinking(tabIndex: number, tabContent: HTMLElement, activeContent: HTMLElement, isLarge: boolean): boolean {
        let isOverFlow: boolean = true;
        let isBreak: boolean = false;
        const tab: RibbonTabModel = this.tabs[parseInt(tabIndex.toString(), 10)];
        for (let j: number = (tab.groups.length - 1); (isOverFlow && (j >= 0)); j--) {
            // eslint-disable-next-line max-len
            isBreak = isLarge ? this.checkLargeToMedium(tabIndex, tab, j, tabContent, activeContent) : this.checkMediumToSmall(tabIndex, tab, j, tabContent
                , activeContent);
            isOverFlow = !isBreak && (tabContent.offsetWidth < activeContent.offsetWidth);
        }
        return isBreak;
    }

    private checkLargeToMedium(tabIndex: number, tab: RibbonTabModel, groupIndex: number, tabContent: HTMLElement
        , activeContent: HTMLElement, shouldSkip: boolean = false): boolean {
        const group: RibbonGroupModel = tab.groups[parseInt(groupIndex.toString(), 10)];
        if (group.isCollapsed && !shouldSkip) { return false; }
        const canReduceCollection: Function = (collection: RibbonCollectionModel): boolean => {
            return (collection.items.length === 1) && canReduceItem(collection.items[0]);
        };
        const canReduceItem: Function = (item: RibbonItemModel): boolean => {
            return (item.allowedSizes & RibbonItemSize.Medium) && (item.activeSize === RibbonItemSize.Large);
        };
        const createShrinkEle: Function = (id: string, firstItem: HTMLElement, start: number, end: number): HTMLElement => {
            const shrinkEle: HTMLElement = this.createElement('div', {
                className: 'e-ribbon-shrink' + constants.SPACE + constants.RIBBON_ROW,
                id: id + '_shrink_container' + start,
                attrs: { 'data-start': start.toString(), 'data-end': end.toString() }
            });
            firstItem.parentElement.insertBefore(shrinkEle, firstItem);
            if (!shouldSkip) { shrinkEle.setAttribute('data-large-width', activeContent.offsetWidth.toString()); }
            return shrinkEle;
        };
        const moveItemToColumn: Function = (start: number, end: number): void => {
            const collection: RibbonCollectionModel = this.tabs[parseInt(tabIndex.toString(), 10)]
                .groups[parseInt(groupIndex.toString(), 10)].collections[0];
            const firstItem: HTMLElement = activeContent.querySelector('#' + collection.items[parseInt(start.toString(), 10)].id + constants.CONTAINER_ID);
            const shrinkEle: HTMLElement = shouldSkip ? activeContent.querySelector('#' + collection.id + '_shrink_container' + start) :
                createShrinkEle(collection.id, firstItem, start, end);
            for (let i: number = start; i <= end; i++) {
                const item: RibbonItemModel = collection.items[parseInt(i.toString(), 10)];
                const ele: HTMLElement = activeContent.querySelector('#' + item.id + constants.CONTAINER_ID);
                shrinkEle.appendChild(ele);
                (item as RibbonItem).setProperties({ activeSize: RibbonItemSize.Medium }, true);
                this.setItemSize(ele.querySelector('#' + item.id), item);
            }
        };
        const moveCollectionToColumn: Function = (start: number, end: number): void => {
            const group: RibbonGroupModel = this.tabs[parseInt(tabIndex.toString(), 10)]
                .groups[parseInt(groupIndex.toString(), 10)];
            const firstItem: HTMLElement = activeContent.querySelector('#' + group.collections[parseInt(start.toString(), 10)].id);
            const shrinkEle: HTMLElement = shouldSkip ? activeContent.querySelector('#' + group.id + '_shrink_container' + start) :
                createShrinkEle(group.id, firstItem, start, end);
            for (let i: number = start; i <= end; i++) {
                const collection: RibbonCollectionModel = group.collections[parseInt(i.toString(), 10)];
                const ele: HTMLElement = activeContent.querySelector('#' + collection.id);
                shrinkEle.appendChild(ele);
                (collection.items[0] as RibbonItem).setProperties({ activeSize: RibbonItemSize.Medium }, true);
                this.setItemSize(ele.querySelector('#' + collection.items[0].id), collection.items[0]);
            }
        };
        const orientation: string = group.orientation;
        if (orientation === ItemOrientation.Column) {
            for (let k: number = (group.collections.length - 1); k > 0; k--) {
                //to avoid negative index while checking for the second collection
                if (((k - 1) >= 0) && canReduceCollection(group.collections[parseInt(k.toString(), 10)])) {
                    if (canReduceCollection(group.collections[k - 1])) {
                        if (((k - 2) >= 0) && canReduceCollection(group.collections[k - 2])) {
                            moveCollectionToColumn(k - 2, k);
                        } else {
                            moveCollectionToColumn(k - 1, k);
                        }
                        k -= 2;
                        if (!shouldSkip && (tabContent.offsetWidth > activeContent.offsetWidth)) { return true; }
                    } else {
                        k--;
                    }
                }
            }
        } else {
            if (group.collections.length === 1) {
                const collection: RibbonCollectionModel = group.collections[0];
                for (let k: number = (collection.items.length - 1); k > 0; k--) {
                    //to avoid negative index while checking for the second item
                    if (((k - 1) >= 0) && canReduceItem(collection.items[parseInt(k.toString(), 10)])) {
                        if (canReduceItem(collection.items[k - 1])) {
                            if (((k - 2) >= 0) && canReduceItem(collection.items[k - 2])) {
                                moveItemToColumn(k - 2, k);
                            } else {
                                moveItemToColumn(k - 1, k);
                            }
                            k -= 2;
                            if (!shouldSkip && (tabContent.offsetWidth > activeContent.offsetWidth)) { return true; }
                        } else {
                            k--;
                        }
                    }
                }
            }
        }
        return false;
    }
    private checkMediumToSmall(tabIndex: number, tab: RibbonTabModel, groupIndex: number, tabContent: HTMLElement
        , activeContent: HTMLElement, shouldSkip: boolean = false): boolean {
        const group: RibbonGroupModel = tab.groups[parseInt(groupIndex.toString(), 10)];
        if (group.isCollapsed && !shouldSkip) { return false; }
        const orientation: string = group.orientation;
        const ele: HTMLElement = activeContent.querySelector('#' + group.id);
        const shrinkColumns: NodeListOf<HTMLElement> = ele.querySelectorAll('.' + 'e-ribbon-shrink');
        const canReduceItem: Function = (item: RibbonItemModel): boolean => {
            return (item.allowedSizes & RibbonItemSize.Small) && (item.activeSize === RibbonItemSize.Medium);
        };
        const reduceItemsToSmall: Function = (collectionIndex: number, start: number, end: number): void => {
            const collection: RibbonCollectionModel = this.tabs[parseInt(tabIndex.toString(), 10)]
                .groups[parseInt(groupIndex.toString(), 10)].collections[parseInt(collectionIndex.toString(), 10)];
            for (let i: number = start; i <= end; i++) {
                const item: RibbonItemModel = collection.items[parseInt(i.toString(), 10)];
                const ele: HTMLElement = activeContent.querySelector('#' + item.id);
                (item as RibbonItem).setProperties({ activeSize: RibbonItemSize.Small }, true);
                this.setItemSize(ele, item);
            }
        };
        const reduceCollectionsToSmall: Function = (index: number, start: number, end: number): void => {
            const group: RibbonGroupModel = this.tabs[parseInt(tabIndex.toString(), 10)]
                .groups[parseInt(groupIndex.toString(), 10)];
            if (!shouldSkip) { shrinkColumns[parseInt(index.toString(), 10)].setAttribute('data-medium-width', activeContent.offsetWidth.toString()); }
            for (let i: number = start; i <= end; i++) {
                const collection: RibbonCollectionModel = group.collections[parseInt(i.toString(), 10)];
                const ele: HTMLElement = activeContent.querySelector('#' + collection.items[0].id);
                (collection.items[0] as RibbonItem).setProperties({ activeSize: RibbonItemSize.Small }, true);
                this.setItemSize(ele, collection.items[0]);
            }
        };
        const setWidth: Function = (id: string): void => {
            if (!shouldSkip) {
                const ele: HTMLElement = activeContent.querySelector('#' + id);
                ele.setAttribute('data-medium-width', activeContent.offsetWidth.toString());
            }
        };
        if (orientation === ItemOrientation.Column) {
            if (shrinkColumns.length > 0) {
                for (let k: number = (shrinkColumns.length - 1); k >= 0; k--) {
                    const start: number = parseInt(shrinkColumns[parseInt(k.toString(), 10)].getAttribute('data-start'), 10);
                    const end: number = parseInt(shrinkColumns[parseInt(k.toString(), 10)].getAttribute('data-end'), 10);
                    //only 2 or 3 itmes alone can be present in shrinked column
                    if (canReduceItem(group.collections[parseInt(start.toString(), 10)].items[0])
                        && canReduceItem(group.collections[start + 1].items[0])) {
                        if ((end - start) === 1) {//if only 2 item, the difference will be 1, else check for 3 rd item satus.
                            reduceCollectionsToSmall(k, start, end);
                        } else if (canReduceItem(group.collections[parseInt(start.toString(), 10)].items[0])) {
                            reduceCollectionsToSmall(k, start, end);
                        }
                        if (!shouldSkip && (tabContent.offsetWidth > activeContent.offsetWidth)) { return true; }
                    }
                }
            }
            for (let k: number = (group.collections.length - 1); k >= 0; k--) {
                const collection: RibbonCollectionModel = group.collections[parseInt(k.toString(), 10)];
                //If items length is 1 then, it would have been already check for shrinked column
                if ((collection.items.length > 1)) {
                    if (canReduceItem(collection.items[0]) && canReduceItem(collection.items[1])) {
                        if (collection.items.length === 2) {
                            setWidth(collection.id);
                            reduceItemsToSmall(k, 0, 1);
                        } else if (canReduceItem(collection.items[2])) {
                            setWidth(collection.id);
                            reduceItemsToSmall(k, 0, 2);
                        }
                        if (!shouldSkip && (tabContent.offsetWidth > activeContent.offsetWidth)) { return true; }
                    }
                }
            }
        } else {
            if (group.collections.length === 1) {
                if (shrinkColumns.length > 0) {
                    for (let k: number = (shrinkColumns.length - 1); k >= 0; k--) {
                        const shrinkColumn: HTMLElement = shrinkColumns[parseInt(k.toString(), 10)];
                        const start: number = parseInt(shrinkColumn.getAttribute('data-start'), 10);
                        const end: number = parseInt(shrinkColumn.getAttribute('data-end'), 10);
                        //only 2 or 3 itmes alone can be present in shrinked column
                        if (canReduceItem(group.collections[0].items[parseInt(start.toString(), 10)])
                            && canReduceItem(group.collections[0].items[start + 1])) {
                            if ((end - start) === 1) {//if only 2 item, the difference will be 1, else check for 3 rd item satus.
                                setWidth(shrinkColumn.id);
                                reduceItemsToSmall(0, start, end);
                            } else if (canReduceItem(group.collections[0].items[parseInt(end.toString(), 10)])) {
                                setWidth(shrinkColumn.id);
                                reduceItemsToSmall(0, start, end);
                            }
                            if (!shouldSkip && (tabContent.offsetWidth > activeContent.offsetWidth)) { return true; }
                        }
                    }
                }
            } else {
                for (let k: number = (group.collections.length - 1); k >= 0; k--) {
                    const collection: RibbonCollectionModel = group.collections[parseInt(k.toString(), 10)];
                    for (let l: number = (collection.items.length - 1); l >= 0; l--) {
                        const item: RibbonItemModel = collection.items[parseInt(l.toString(), 10)];
                        if (canReduceItem(item)) {
                            setWidth(item.id);
                            reduceItemsToSmall(k, l, l);
                            if (!shouldSkip && (tabContent.offsetWidth > activeContent.offsetWidth)) { return true; }
                        }
                    }
                }
            }
        }
        return false;
    }
    private checkGroupExpanding(tabIndex: number, tabContent: HTMLElement, activeContent: HTMLElement, isSmall: boolean): boolean {
        let isBreak: boolean = false;
        const tab: RibbonTabModel = this.tabs[parseInt(tabIndex.toString(), 10)];
        for (let j: number = 0; (!isBreak && (j < tab.groups.length)); j++) {
            isBreak = isSmall ? this.checkSmallToMedium(tabIndex, tab, j, tabContent, activeContent, false, true) :
                this.checkMediumToLarge(tabIndex, tab, j, tabContent, activeContent, false, true);
        }
        return isBreak;
    }

    // eslint-disable-next-line max-len
    private checkSmallToMedium(tabIndex: number, tab: RibbonTabModel, groupIndex: number, tabContent: HTMLElement, activeContent: HTMLElement
        , shouldSkip: boolean, shouldClear: boolean): boolean {
        const group: RibbonGroupModel = tab.groups[parseInt(groupIndex.toString(), 10)];
        const orientation: string = group.orientation;
        const ele: HTMLElement = activeContent.querySelector('#' + group.id);
        const shrinkColumns: NodeListOf<HTMLElement> = ele.querySelectorAll('.' + 'e-ribbon-shrink');
        const canExpandItem: Function = (item: RibbonItemModel): boolean => {
            return (item.allowedSizes & RibbonItemSize.Medium) && (item.activeSize === RibbonItemSize.Small);
        };
        const expandItemsToMedium: Function = (collectionIndex: number, start: number, end: number, parentEle: HTMLElement): void => {
            const collection: RibbonCollectionModel = this.tabs[parseInt(tabIndex.toString(), 10)]
                .groups[parseInt(groupIndex.toString(), 10)].collections[parseInt(collectionIndex.toString(), 10)];
            for (let i: number = start; i <= end; i++) {
                const item: RibbonItemModel = collection.items[parseInt(i.toString(), 10)];
                const ele: HTMLElement = parentEle.id === item.id ? parentEle : parentEle.querySelector('#' + item.id);
                (item as RibbonItem).setProperties({ activeSize: RibbonItemSize.Medium }, true);
                this.setItemSize(ele, item);
            }
        };
        const expandCollectionsToMedium: Function = (start: number, end: number): void => {
            const collections: RibbonCollectionModel[] = this.tabs[parseInt(tabIndex.toString(), 10)]
                .groups[parseInt(groupIndex.toString(), 10)].collections;
            for (let i: number = start; i <= end; i++) {
                const ele: HTMLElement = activeContent.querySelector('#' + collections[parseInt(i.toString(), 10)].items[0].id);
                (collections[parseInt(i.toString(), 10)].items[0] as RibbonItem).setProperties({ activeSize: RibbonItemSize.Medium }, true);
                this.setItemSize(ele, collections[parseInt(i.toString(), 10)].items[0]);
            }
        };
        if (orientation === ItemOrientation.Row) {
            // collection length is 1, then the it wll be covered in shrinked columns
            if (group.collections.length !== 1) {
                for (let k: number = 0; k < group.collections.length; k++) {
                    const collection: RibbonCollectionModel = group.collections[parseInt(k.toString(), 10)];
                    for (let l: number = 0; l < collection.items.length; l++) {
                        const item: RibbonItemModel = collection.items[parseInt(l.toString(), 10)];
                        if (canExpandItem(item)) {
                            const itemEle: HTMLElement = activeContent.querySelector('#' + item.id);
                            const valString: string = itemEle.getAttribute('data-medium-width');
                            const value: number = valString ? parseInt(valString, 10) : null;
                            if (value && (shouldSkip || (tabContent.offsetWidth > value))) {
                                expandItemsToMedium(k, l, l, itemEle);
                                if (!shouldSkip || shouldClear) { itemEle.removeAttribute('data-medium-width'); }
                            } else if (value) { return true; }
                        }
                    }
                }
            }
        } else {
            for (let k: number = 0; k < group.collections.length; k++) {
                //If items length is 1 then, it will be handled in shrinked column
                if ((group.collections[parseInt(k.toString(), 10)].items.length > 1)) {
                    const collection: RibbonCollectionModel = group.collections[parseInt(k.toString(), 10)];
                    const itemEle: HTMLElement = activeContent.querySelector('#' + collection.id);
                    const valString: string = itemEle.getAttribute('data-medium-width');
                    const value: number = valString ? parseInt(valString, 10) : null;
                    if (value && (shouldSkip || (tabContent.offsetWidth > value))) {
                        expandItemsToMedium(k, 0, (collection.items.length === 2) ? 1 : 2, itemEle);
                        if (!shouldSkip || shouldClear) { itemEle.removeAttribute('data-medium-width'); }
                    } else if (value) { return true; }
                }
            }
        }
        if (shrinkColumns.length > 0) {
            for (let k: number = 0; k < shrinkColumns.length; k++) {
                const shrinkColumn: HTMLElement = shrinkColumns[parseInt(k.toString(), 10)];
                const valString: string = shrinkColumn.getAttribute('data-medium-width');
                const value: number = valString ? parseInt(valString, 10) : null;
                if (value && (shouldSkip || (tabContent.offsetWidth > value))) {
                    const start: number = parseInt(shrinkColumn.getAttribute('data-start'), 10);
                    const end: number = parseInt(shrinkColumn.getAttribute('data-end'), 10);
                    if (orientation === ItemOrientation.Row) {
                        expandItemsToMedium(0, start, end, shrinkColumn);
                    } else {
                        expandCollectionsToMedium(start, end);
                    }
                    if (!shouldSkip || shouldClear) { shrinkColumn.removeAttribute('data-medium-width'); }
                } else if (value) { return true; }
            }
        }
        return false;
    }
    private checkMediumToLarge(tabIndex: number, tab: RibbonTabModel, groupIndex: number, tabContent: HTMLElement
        , activeContent: HTMLElement, shouldSkip: boolean, shouldClear: boolean): boolean {
        const group: RibbonGroupModel = tab.groups[parseInt(groupIndex.toString(), 10)];
        const orientation: string = group.orientation;
        const ele: HTMLElement = activeContent.querySelector('#' + group.id);
        const shrinkColumns: NodeListOf<HTMLElement> = ele.querySelectorAll('.' + 'e-ribbon-shrink');
        if (shrinkColumns.length === 0) { return false; }
        const expandItemsToLarge: Function = (start: number, end: number, parentEle: HTMLElement): void => {
            const items: RibbonItemModel[] = this.tabs[parseInt(tabIndex.toString(), 10)].
                groups[parseInt(groupIndex.toString(), 10)].collections[0].items;
            for (let i: number = end; i >= start; i--) {
                const item: RibbonItemModel = items[parseInt(i.toString(), 10)];
                const container: HTMLElement = parentEle.querySelector('#' + item.id + constants.CONTAINER_ID);
                const ele: HTMLElement = container.querySelector('#' + item.id);
                (item as RibbonItem).setProperties({ activeSize: RibbonItemSize.Large }, true);
                this.setItemSize(ele, item);
                parentEle.insertAdjacentElement('afterend', container);
            }
            if (!shouldSkip || shouldClear) { remove(parentEle); }
        };
        const expandCollectionsToLarge: Function = (start: number, end: number, parentEle: HTMLElement): void => {
            const collections: RibbonCollectionModel[] = this.tabs[parseInt(tabIndex.toString(), 10)].
                groups[parseInt(groupIndex.toString(), 10)].collections;
            for (let i: number = end; i >= start; i--) {
                const collection: RibbonCollectionModel = collections[parseInt(i.toString(), 10)];
                const collectionEle: HTMLElement = parentEle.querySelector('#' + collection.id);
                const ele: HTMLElement = collectionEle.querySelector('#' + collection.items[0].id);
                (collection.items[0] as RibbonItem).setProperties({ activeSize: RibbonItemSize.Large }, true);
                this.setItemSize(ele, collection.items[0]);
                parentEle.insertAdjacentElement('afterend', collectionEle);
            }
            if (!shouldSkip || shouldClear) { remove(parentEle); }
        };
        for (let k: number = 0; k < shrinkColumns.length; k++) {
            const shrinkColumn: HTMLElement = shrinkColumns[parseInt(k.toString(), 10)];
            const valString: string = shrinkColumn.getAttribute('data-large-width');
            const value: number = valString ? parseInt(valString, 10) : null;
            if (value && (shouldSkip || (tabContent.offsetWidth > value))) {
                const start: number = parseInt(shrinkColumn.getAttribute('data-start'), 10);
                const end: number = parseInt(shrinkColumn.getAttribute('data-end'), 10);
                if (orientation === ItemOrientation.Row) {
                    expandItemsToLarge(start, end, shrinkColumn);
                } else {
                    expandCollectionsToLarge(start, end, shrinkColumn);
                }
                if (!shouldSkip || shouldClear) { shrinkColumn.removeAttribute('data-large-width'); }
            } else if (value) { return true; }
        }
        return false;
    }

    private setItemSize(itemEle: HTMLElement, item: RibbonItemModel): void {
        const itemContainer: HTMLElement = itemEle.closest('.' + constants.RIBBON_ITEM) as HTMLElement;
        if (item.type === RibbonItemType.Button) {
            this.ribbonButtonModule.updateButtonSize(itemEle, item);
        } else if (item.type === RibbonItemType.DropDown) {
            this.ribbonDropDownModule.updateDropDownSize(itemEle, item);
        } else if (item.type === RibbonItemType.SplitButton) {
            this.ribbonSplitButtonModule.updateSplitButtonSize(itemEle, item);
        } else if (item.type === RibbonItemType.Template) {
            remove(itemEle);
            this.createTemplateContent(item, itemContainer);
        }
        itemContainer.classList.remove(constants.RIBBON_CONTENT_HEIGHT, constants.RIBBON_LARGE_ITEM
            , constants.RIBBON_MEDIUM_ITEM, constants.RIBBON_SMALL_ITEM);
        if (item.activeSize === RibbonItemSize.Large) {
            itemContainer.classList.add(constants.RIBBON_LARGE_ITEM, constants.RIBBON_CONTENT_HEIGHT);
        } else {
            itemContainer.classList.add((item.activeSize === RibbonItemSize.Medium) ?
                constants.RIBBON_MEDIUM_ITEM : constants.RIBBON_SMALL_ITEM);
        }
    }

    private createOverflowDropdown(tabIndex: number, tabContent: HTMLElement, activeContent: HTMLElement): void {
        const collapseOrder: RibbonGroupModel[] = this.getGroupResizeOrder(true, tabIndex);
        if (collapseOrder.length === 0) { return; }
        for (let i: number = 0; ((i < collapseOrder.length) && (tabContent.offsetWidth < activeContent.offsetWidth)); i++) {
            const group: RibbonGroupModel = collapseOrder[parseInt(i.toString(), 10)];
            const groupEle: HTMLElement = this.tabObj.element.querySelector('#' + group.id);
            groupEle.setAttribute('data-expanded-width', activeContent.offsetWidth.toString());
            const groupContainer: HTMLElement = groupEle.querySelector('#' + group.id + constants.CONTAINER_ID);
            const groupOverFlow: HTMLElement = this.createElement('div', {
                className: constants.RIBBON_GROUP_OVERFLOW + constants.SPACE + constants.RIBBON_LARGE_ITEM,
                id: group.id + constants.OVERFLOW_ID + constants.CONTAINER_ID
            });
            groupEle.insertBefore(groupOverFlow, groupContainer);
            const groupIndex: number = getIndex(this.tabs[parseInt(tabIndex.toString(), 10)].groups
                , (e: RibbonGroup) => { return e.id === group.id; });
            const tab: RibbonTabModel = this.tabs[parseInt(tabIndex.toString(), 10)];
            //Expanding the items in the group to their original expanded state
            this.checkSmallToMedium(tabIndex, tab, groupIndex, tabContent, activeContent, true, false);
            this.checkMediumToLarge(tabIndex, tab, groupIndex, tabContent, activeContent, true, false);
            const dropdown: DropDownButton = this.ribbonDropDownModule.createOverFlowDropDown(group.id, group.header, group.groupIconCss,
                                                                                              groupContainer, groupOverFlow);
            (this.tabs[parseInt(tabIndex.toString(), 10)].
                groups[parseInt(groupIndex.toString(), 10)] as RibbonGroup).setProperties({ isCollapsed: true }, true);
            for (let j: number = 0; j < group.collections.length; j++) {
                const collection: RibbonCollectionModel = group.collections[parseInt(j.toString(), 10)];
                const collectionEle: HTMLElement = groupContainer.querySelector('#' + collection.id);
                for (let k: number = 0; k < collection.items.length; k++) {
                    const item: RibbonItemModel = collection.items[parseInt(k.toString(), 10)];
                    const itemEle: HTMLElement = collectionEle.querySelector('#' + item.id + constants.CONTAINER_ID);
                    this.addOverflowEvents(item, itemEle, dropdown);
                }
            }
        }
    }

    // eslint-disable-next-line max-len
    private removeOverflowDropdown(tabContent: HTMLElement, activeContent: HTMLElement, isClear: boolean = false, tabIndex?: number): boolean {
        const expandOrder: RibbonGroupModel[] = this.getGroupResizeOrder(false, tabIndex);
        if (expandOrder.length === 0) { return false; }
        for (let i: number = 0; i < expandOrder.length; i++) {
            const group: RibbonGroupModel = expandOrder[parseInt(i.toString(), 10)];
            const groupEle: HTMLElement = this.tabObj.element.querySelector('#' + group.id);
            if (!groupEle) { break; } //to handle the rerendering of tabcontrol when a ribbon tab is added/removed
            const width: number = parseInt(groupEle.getAttribute('data-expanded-width'), 10);
            if (!isClear && (tabContent.offsetWidth < width)) { return true; }
            this.removeDropdown(group.id);
            const groupIndex: number = getIndex(this.tabs[parseInt(tabIndex.toString(), 10)].groups
                , (e: RibbonGroup) => { return e.id === group.id; });
            (this.tabs[parseInt(tabIndex.toString(), 10)].
                groups[parseInt(groupIndex.toString(), 10)] as RibbonGroup).setProperties({ isCollapsed: false }, true);
            const tab: RibbonTabModel = this.tabs[parseInt(tabIndex.toString(), 10)];
            //Shrinking the items in the group to their previous shrinked state (before moving to dropdown)
            this.checkLargeToMedium(tabIndex, tab, groupIndex, tabContent, activeContent, true);
            this.checkMediumToSmall(tabIndex, tab, groupIndex, tabContent, activeContent, true);
            for (let j: number = 0; j < group.collections.length; j++) {
                const collection: RibbonCollectionModel = group.collections[parseInt(j.toString(), 10)];
                const collectionEle: HTMLElement = groupEle.querySelector('#' + collection.id);
                for (let k: number = 0; k < collection.items.length; k++) {
                    const item: RibbonItemModel = collection.items[parseInt(k.toString(), 10)];
                    const itemEle: HTMLElement = collectionEle.querySelector('#' + item.id + constants.CONTAINER_ID);
                    this.removeOverflowEvent(item, itemEle);
                }
            }
        }
        return false;
    }

    private removeDropdown(groupId: string): void {
        const dropdownElement: HTMLElement = this.tabObj.element.querySelector('#' + groupId + constants.OVERFLOW_ID + constants.DROPDOWN_ID);
        if (dropdownElement) {
            const groupOverFlow: HTMLElement = dropdownElement.parentElement;
            this.ribbonDropDownModule.removeOverFlowDropDown(dropdownElement);
            remove(groupOverFlow);
        }
    }

    private getGroupResizeOrder(isCollapse: boolean, tabIndex: number): RibbonGroupModel[] {
        let groups: RibbonGroupModel[] = this.tabs[parseInt(tabIndex.toString(), 10)].groups;
        groups = groups.filter((e: RibbonGroupModel) => {
            // (isUndefined(e.isCollapsible) || e.isCollapsible) => check whethe rhte item is collapsible
            // if a isCollapsed property is undefined, then it is considered collapsible and included in collapsible list
            // ((isCollapse && !e.isCollapsed)||(!isCollapse && e.isCollapsed)) => isCollapse !== e.isCollapsed
            return (this.activeLayout === 'Classic') ? (isUndefined(e.isCollapsible) || e.isCollapsible) && ((isCollapse &&
                isUndefined(e.isCollapsed)) || (!isUndefined(e.isCollapsed) && (isCollapse !== e.isCollapsed))) : true;
        });
        //sort the collapsible groups based on the priority
        groups.sort((a: RibbonGroup, b: RibbonGroup) => a.priority - b.priority);
        //reverse the sorted array to return the array in descending order while collapsing.
        return isCollapse ? groups.reverse() : groups;
    }

    private destroyScroll(): void {
        if (this.scrollModule) {
            this.scrollModule.destroy();
            this.scrollModule = null;
        }
    }

    private clearOverflowDropDown(index: number): void {
        const activeContent: HTMLElement = this.tabObj.element.querySelector('#' + this.tabs[parseInt(index.toString(), 10)].id + constants.CONTENT_ID);
        if (!activeContent) { return; }
        const tabContent: HTMLElement = activeContent.closest('.' + constants.TAB_CONTENT) as HTMLElement;
        if (this.activeLayout === 'Simplified') { this.removeSimplfiedOverflow(activeContent, tabContent, index, true); }
        else { this.removeOverflowDropdown(activeContent, tabContent, true, index); }
    }

    private ribbonTabSelecting(e: SelectingEventArgs): void {
        const nextTabId: string = e.selectingItem.getAttribute('data-id');
        const previousTabId: string = e.previousItem.getAttribute('data-id');
        let nextIndex: number = getIndex<RibbonTabModel>(this.tabs, ((tab: RibbonTabModel) => (tab.id === nextTabId)));
        const previousIndex: number = getIndex<RibbonTabModel>(this.tabs, ((tab: RibbonTabModel) => (tab.id === previousTabId)));
        nextIndex = nextIndex === -1 ? this.selectedTab : nextIndex;
        const eventArgs: TabSelectingEventArgs = {
            cancel: e.cancel, isInteracted: e.isInteracted, previousIndex: previousIndex, selectedIndex: nextIndex
        };
        this.trigger('tabSelecting', eventArgs, (args: TabSelectingEventArgs) => {
            if (args.cancel) { return; }
            this.destroyScroll();
            if (!this.isAddRemove && (previousIndex !== -1)) { this.clearOverflowDropDown(previousIndex); }
            const selectedTabContent: HTMLElement = this.tabObj.items[parseInt(nextIndex.toString(), 10)].content as HTMLElement;
            if ((!selectedTabContent.querySelector('.' + constants.RIBBON_GROUP)) && (this.tabs[parseInt(nextIndex.toString(), 10)].groups.length !== 0)) {
                const elements: HTMLElement[] = this.createGroups(this.tabs[parseInt(nextIndex.toString(), 10)].groups, nextIndex);
                append(elements, selectedTabContent);
            }
        });
    }

    private createTabItems(tabs: RibbonTabModel[]): TabItemModel[] {
        const tabItems: TabItemModel[] = [];
        for (let i: number = 0; i < tabs.length; i++) {
            const ribbonTab: RibbonTabModel = tabs[parseInt(i.toString(), 10)];
            const header: HTMLElement = this.createElement('span', {
                innerHTML: ribbonTab.header,
                id: ribbonTab.id + constants.HEADER_ID
            });
            header.onclick = () => { this.minimize(false); };
            header.ondblclick = () => { this.minimize(true); };
            const tab: TabItemModel = { header: { text: header }, id: ribbonTab.id, cssClass: ribbonTab.cssClass };
            const content: HTMLElement = this.createElement('div', {
                className: tab.cssClass,
                id: ribbonTab.id + constants.CONTENT_ID
            });
            content.classList.add(constants.RIBBON_TAB_ITEM);
            tab.content = content;
            tabItems.push(tab);
        }
        return tabItems;
    }

    private renderInitialTab(index: number): void {
        const elements: HTMLElement[] = this.createGroups(this.tabs[parseInt(index.toString(), 10)].groups, index);
        const content: HTMLElement = this.tabObj.items[parseInt(index.toString(), 10)].content as HTMLElement;
        append(elements, content);
        if (this.activeLayout === 'Simplified') {
            this.element.classList.add(constants.RIBBON_SIMPLIFIED_MODE);
        }
        const activeContent: HTMLElement = this.tabObj.element.querySelector('#' + this.tabs[this.selectedTab].id + constants.CONTENT_ID);
        this.checkOverflow(this.selectedTab, activeContent);
    }

    private addOverflowButton(btnId: string): DropDownButton {
        const overflowButton: HTMLButtonElement = this.createElement('button', {
            id: btnId
        });
        const overflowTarget: HTMLElement = this.createElement('div', {
            className: constants.RIBBON_OVERFLOW_TARGET
        });
        const overflowDDB: DropDownButton = new DropDownButton({
            iconCss: constants.OVERFLOW_ICON,
            cssClass: constants.DROPDOWNBUTTON_HIDE + constants.SPACE + constants.RIBBON_GROUP_OVERFLOW_DDB,
            target: overflowTarget,
            locale: this.locale,
            enableRtl: this.enableRtl,
            enablePersistence: this.enablePersistence,
            beforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
                const ele: Element = args.event ? closest(args.event.target as HTMLElement, '.' + constants.RIBBON_POPUP_CONTROL) : null;
                if (ele) { args.cancel = true; }
            }
        }, overflowButton);
        this.element.classList.add(constants.RIBBON_OVERFLOW);
        createTooltip(overflowTarget, this);
        return overflowDDB;
    }
    private removeOverflowButton(overflowDDB: DropDownButton): void {
        if (overflowDDB) {
            const btnEle: HTMLElement = overflowDDB.element;
            destroyTooltip(overflowDDB.target as HTMLElement);
            overflowDDB.destroy();
            btnEle.remove();
        }
    }

    private removeOverflowEvent(item: RibbonItemModel, itemEle: HTMLElement): void {
        switch (item.type) {
        case 'Button':
            this.ribbonButtonModule.removeOverFlowEvents(item, itemEle);
            break;
        case 'DropDown':
            this.ribbonDropDownModule.removeOverFlowEvents(item, itemEle);
            break;
        case 'SplitButton':
            this.ribbonSplitButtonModule.removeOverFlowEvents(item, itemEle);
            break;
        case 'CheckBox':
            this.ribbonCheckBoxModule.removeOverFlowEvents(item, itemEle);
            break;
        case 'ColorPicker':
            this.ribbonColorPickerModule.removeOverFlowEvents(item, itemEle);
            break;
        case 'ComboBox':
            this.ribbonComboBoxModule.removeOverFlowEvents(item, itemEle);
            break;
        }
    }

    private createGroupContainer(groupId: string, groupHeader: string): HTMLElement {
        const ofGroupContainer: HTMLElement = this.createElement('div', {
            className: constants.RIBBON_OF_GROUP_CONTAINER,
            id: groupId + constants.CONTAINER_ID
        });
        const ofGroupHeader: HTMLElement = this.createElement('div', {
            className: constants.RIBBON_OVERFLOW_HEADER,
            id: groupId + constants.HEADER_ID,
            innerHTML: groupHeader
        });
        ofGroupContainer.append(ofGroupHeader);
        return ofGroupContainer;
    }

    private addExpandCollapse(): void {
        this.collapseButton = this.createElement('span', {
            className: constants.RIBBON_COLLAPSE_BUTTON + constants.SPACE + constants.EXPAND_COLLAPSE_ICON,
            id: this.tabObj.element.id + constants.COLLAPSE_BUTTON_ID,
            attrs: { 'tabindex': '0', 'type': 'button', 'aria-label': 'Layout Switcher', 'role': 'button' }
        });
        this.collapseButton.onclick = () => { this.toggleLayout(); };
        this.collapseButton.onkeydown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') { this.toggleLayout(); }
        };
        this.element.classList.add(constants.RIBBON_COLLAPSIBLE);
        if (this.activeLayout === 'Simplified') { this.collapseButton.classList.add(constants.RIBBON_EXPAND_BUTTON); }
        this.tabObj.element.appendChild(this.collapseButton);
    }

    private removeExpandCollapse(): void {
        const index: number = getIndex(this.tooltipData, (e: RibbonTooltipModel) => { return e.id === this.collapseButton.id; });
        if (index !== -1) {
            this.tooltipData.splice(index, 1);
        }
        this.element.classList.remove(constants.RIBBON_COLLAPSIBLE);
        remove(this.tabObj.element.querySelector('.' + constants.RIBBON_COLLAPSE_BUTTON));
        this.collapseButton = null;
    }

    private reRenderTabs(): void {
        this.destroyScroll();
        this.destroyTabItems(this.tabsInternal);
        this.checkID(this.tabs, 'tab', this.element.id);
        this.tabsInternal = this.tabs.slice();
        this.validateItemSize();
        const tabItems: TabItemModel[] = this.createTabItems(this.tabs);
        if (this.selectedTab >= this.tabs.length) { this.selectedTab = this.tabs.length - 1; }
        this.tabObj.setProperties({ items: tabItems, selectedItem: this.selectedTab });
        const contentEle: HTMLElement = this.tabObj.items[this.selectedTab].content as HTMLElement;
        if (contentEle.innerHTML === '') {
            this.renderInitialTab(this.selectedTab);
        }
    }

    private switchLayout(): void {
        this.destroyScroll();
        this.collapseButton.classList.toggle(constants.RIBBON_EXPAND_BUTTON, this.activeLayout === 'Simplified');
        this.element.classList.toggle(constants.RIBBON_SIMPLIFIED_MODE, this.activeLayout === 'Simplified');
        for (let i: number = 0; i <= (this.tabs.length - 1); i++) {
            const tabIndex: number = i;
            const contentEle: HTMLElement = this.tabObj.items[parseInt(tabIndex.toString(), 10)].content as HTMLElement;
            if (contentEle.innerHTML !== '') {
                const tab: RibbonTabModel = this.tabs[parseInt(tabIndex.toString(), 10)];
                const groupList: RibbonGroupModel[] = this.tabs[parseInt(tabIndex.toString(), 10)].groups;
                const activeContent: HTMLElement = this.tabObj.element.querySelector('#' + this.tabs[parseInt(tabIndex.toString(), 10)].id + constants.CONTENT_ID);
                const tabContent: HTMLElement = activeContent.closest('.' + constants.TAB_CONTENT) as HTMLElement;
                if (this.activeLayout === 'Simplified') {
                    for (let i: number = 0; i < groupList.length; i++) {
                        const group: RibbonGroupModel = groupList[parseInt(i.toString(), 10)];
                        if (group.isCollapsed) {
                            (group as RibbonGroup).setProperties({ isCollapsed: false }, true);
                            this.removeDropdown(group.id);
                        } else {
                            this.checkSmallToMedium(tabIndex, tab, i, tabContent, activeContent, true, false);
                            this.checkMediumToLarge(tabIndex, tab, i, tabContent, activeContent, true, false);
                        }
                        const groupEle: HTMLElement = tabContent.querySelector('#' + group.id);
                        const groupContainer: HTMLElement = groupEle.querySelector('#' + group.id + constants.CONTAINER_ID);
                        const shrinkColumns: NodeListOf<HTMLElement> = groupContainer.querySelectorAll('.' + 'e-ribbon-shrink');
                        for (let i: number = 0; i < shrinkColumns.length; i++) {
                            shrinkColumns[parseInt(i.toString(), 10)].remove();
                        }
                        const groupHeader: HTMLElement = groupContainer.querySelector('#' + group.id + constants.HEADER_ID);
                        groupHeader.remove();
                        const groupContent: HTMLElement = groupContainer.querySelector('#' + group.id + constants.CONTENT_ID);
                        groupContent.classList.replace(constants.RIBBON_ROW, constants.RIBBON_COLUMN);
                        groupContent.classList.remove(constants.RIBBON_CONTENT_HEIGHT);
                        for (let j: number = 0; j < group.collections.length; j++) {
                            const collection: RibbonCollectionModel = group.collections[parseInt(j.toString(), 10)];
                            const groupCollection: HTMLElement = groupContainer.querySelector('#' + collection.id);
                            groupCollection.classList.replace(constants.RIBBON_ROW, constants.RIBBON_COLUMN);
                            for (let k: number = 0; k < collection.items.length; k++) {
                                const itemList: RibbonItemModel[] = collection.items;
                                let item: RibbonItemModel = collection.items[parseInt(k.toString(), 10)];
                                let flag: boolean = true;
                                while ((flag) && (item.displayOptions === DisplayMode.None)) {
                                    k++;
                                    const itemEle: HTMLElement = groupContainer.querySelector('#' + item.id + constants.CONTAINER_ID);
                                    const ele: HTMLElement = itemEle.querySelector('#' + item.id);
                                    this.destroyFunction(item, ele);
                                    itemEle.remove();
                                    if (k < itemList.length) { item = itemList[parseInt(k.toString(), 10)]; } else { flag = false; }
                                }
                                if (!flag) { break; }
                                const itemEle: HTMLElement = groupContainer.querySelector('#' + item.id + constants.CONTAINER_ID);
                                const ele: HTMLElement = itemEle.querySelector('#' + item.id);
                                let size: RibbonItemSize = ((item.allowedSizes === RibbonItemSize.Large) ||
                                    (item.allowedSizes & RibbonItemSize.Medium)) ? RibbonItemSize.Medium : RibbonItemSize.Small;
                                if (item.displayOptions === DisplayMode.Overflow) {
                                    this.createOverflowPopup(item, tabIndex, group.enableGroupOverflow, group.id, group.header,
                                                             itemEle, groupContainer);
                                    size = RibbonItemSize.Medium;
                                    if ((item.type === RibbonItemType.DropDown) || (item.type === RibbonItemType.SplitButton)) {
                                        this.updatePopupItems(item, itemEle, group.enableGroupOverflow, true);
                                    }
                                }
                                (item as RibbonItem).setProperties({ activeSize: size }, true);
                                this.setItemSize(ele, item);
                            }
                        }
                        if (!(group.enableGroupOverflow || groupEle.querySelector('.' + constants.RIBBON_ITEM))) {
                            groupEle.classList.add('e-ribbon-emptyCollection');
                        }
                    }
                }
                else {
                    this.element.classList.remove(constants.RIBBON_OVERFLOW);
                    for (let i: number = 0; i < groupList.length; i++) {
                        const group: RibbonGroupModel = groupList[parseInt(i.toString(), 10)];
                        const alignType: string = groupList[parseInt(i.toString(), 10)].orientation;
                        const groupContainer: HTMLElement = tabContent.querySelector('#' + group.id + constants.CONTAINER_ID);
                        const groupContent: HTMLElement = groupContainer.querySelector('#' + group.id + constants.CONTENT_ID);
                        const groupHeader: HTMLElement = this.createElement('div', {
                            className: constants.RIBBON_GROUP_HEADER,
                            id: group.id + constants.HEADER_ID,
                            innerHTML: group.header
                        });
                        groupContainer.appendChild(groupHeader);
                        if (alignType === 'Row') { groupContent.classList.replace(constants.RIBBON_COLUMN, constants.RIBBON_ROW); }
                        groupContent.classList.add(constants.RIBBON_CONTENT_HEIGHT);
                        for (let j: number = 0; j < group.collections.length; j++) {
                            let overflowDDB: DropDownButton;
                            let overflowtarget: HTMLElement;
                            if (!group.enableGroupOverflow) {
                                overflowDDB = this.overflowDDB;
                                if (overflowDDB) {
                                    overflowtarget = this.overflowDDB.target as HTMLElement;
                                }
                            }
                            else {
                                const overflowDDBEle: HTMLElement = groupContainer.querySelector('#' + group.id + constants.GROUPOF_BUTTON_ID);
                                if (overflowDDBEle) {
                                    overflowDDB = getInstance(overflowDDBEle, DropDownButton) as DropDownButton;
                                    overflowtarget = overflowDDB.target as HTMLElement;
                                }
                            }
                            const collection: RibbonCollectionModel = group.collections[parseInt(j.toString(), 10)];
                            const groupCollection: HTMLElement = groupContainer.querySelector('#' + collection.id);
                            if (alignType === 'Column') { groupCollection.classList.replace(constants.RIBBON_COLUMN, constants.RIBBON_ROW); }
                            for (let k: number = 0; k < collection.items.length; k++) {
                                const item: RibbonItemModel = collection.items[parseInt(k.toString(), 10)];
                                if (item.displayOptions === DisplayMode.None) {
                                    const itemEle: HTMLElement = this.createItems([item], alignType, group.id, group.header
                                        , group.enableGroupOverflow, tabIndex)[0];
                                    groupCollection.append(itemEle);
                                }
                                else if ((item.displayOptions === DisplayMode.Overflow)) {
                                    const itemEle: HTMLElement = overflowtarget.querySelector('#' + item.id + constants.CONTAINER_ID);
                                    if ((item.type === RibbonItemType.DropDown) || (item.type === RibbonItemType.SplitButton)) {
                                        this.updatePopupItems(item, itemEle, group.enableGroupOverflow, false);
                                    }
                                    groupCollection.append(itemEle);
                                    this.removeOverflowEvent(item, itemEle);
                                }
                                else if ((item.displayOptions === DisplayMode.Simplified)) {
                                    //To make sure the items are in proper order
                                    const itemEle: HTMLElement = groupContainer.querySelector('#' + item.id + constants.CONTAINER_ID);
                                    groupCollection.append(itemEle);
                                }
                                else {
                                    let itemEle: HTMLElement = groupContainer.querySelector('#' + item.id + constants.CONTAINER_ID);
                                    if (!itemEle) {
                                        itemEle = overflowtarget.querySelector('#' + item.id + constants.CONTAINER_ID);
                                        if ((item.type === RibbonItemType.DropDown) || (item.type === RibbonItemType.SplitButton)) {
                                            this.updatePopupItems(item, itemEle, group.enableGroupOverflow, false);
                                        }
                                        this.removeOverflowEvent(item, itemEle);
                                    }
                                    groupCollection.append(itemEle);
                                }
                                const ele: HTMLElement = groupContainer.querySelector('#' + item.id);
                                const itemsize: RibbonItemSize = (item.allowedSizes & RibbonItemSize.Large) ? RibbonItemSize.Large :
                                    (item.allowedSizes & RibbonItemSize.Medium) ? RibbonItemSize.Medium : RibbonItemSize.Small;
                                (item as RibbonItem).setProperties({ activeSize: itemsize }, true);
                                this.setItemSize(ele, item);
                            }
                            if (group.enableGroupOverflow && overflowDDB) {
                                if (overflowtarget.childElementCount === 0) { this.removeOverflowButton(overflowDDB); }
                            }
                        }
                    }
                }
                if (this.selectedTab === tabIndex) { this.checkOverflow(tabIndex, activeContent); }
            }
        }
        if (this.activeLayout === 'Classic') {
            this.removeOverflowButton(this.overflowDDB);
            this.overflowDDB = null;
        }
    }

    private launcherIconClicked(id: string): void {
        const eventArgs: LauncherClickEventArgs = { groupId: id };
        this.trigger('launcherIconClick', eventArgs);
    }

    private createGroups(groupList: RibbonGroupModel[], tabIndex: number): HTMLElement[] {
        const groupElements: HTMLElement[] = [];
        for (let i: number = 0; i < groupList.length; i++) {
            const group: RibbonGroupModel = groupList[parseInt(i.toString(), 10)];
            const alignType: string = group.orientation;
            const groupEle: HTMLElement = this.createElement('div', {
                className: group.cssClass,
                id: group.id
            });
            groupEle.classList.add(constants.RIBBON_GROUP);
            groupElements.push(groupEle);
            const groupContainer: HTMLElement = this.createElement('div', {
                className: group.cssClass,
                id: group.id + constants.CONTAINER_ID
            });
            groupContainer.classList.add(constants.RIBBON_GROUP_CONTAINER);
            groupEle.appendChild(groupContainer);
            const groupContent: HTMLElement = this.createElement('div', {
                className: this.activeLayout === 'Simplified' ? constants.RIBBON_GROUP_CONTENT : (constants.RIBBON_GROUP_CONTENT + constants.SPACE + constants.RIBBON_CONTENT_HEIGHT),
                id: group.id + constants.CONTENT_ID
            });
            groupContent.classList.add(((alignType === 'Column') || (this.activeLayout === 'Simplified')) ? constants.RIBBON_COLUMN : constants.RIBBON_ROW);
            groupContainer.appendChild(groupContent);
            if (this.activeLayout === 'Classic') {
                const groupHeader: HTMLElement = this.createElement('div', {
                    className: constants.RIBBON_GROUP_HEADER,
                    id: group.id + constants.HEADER_ID,
                    innerHTML: group.header
                });
                groupContainer.appendChild(groupHeader);
            }
            if (group.showLauncherIcon) {
                const launcherIcon: HTMLElement = this.createElement('div', {
                    className: constants.RIBBON_LAUNCHER_ICON_ELE + ' ' + (this.launcherIconCss ? this.launcherIconCss : constants.RIBBON_LAUNCHER_ICON),
                    id: group.id + constants.LAUNCHER_ID,
                    attrs: { 'tabindex': '0', 'type': 'button', 'aria-label': 'Launcher Icon', 'role': 'button' }
                });
                groupContainer.appendChild(launcherIcon);
                groupContainer.classList.add(constants.RIBBON_LAUNCHER);
                EventHandler.add(launcherIcon, 'click', this.launcherIconClicked.bind(this, group.id), this);
                EventHandler.add(launcherIcon, 'keydown', (e: KeyboardEvent) => {
                    if (e.key === 'Enter') { this.launcherIconClicked(group.id); }
                }, this);
            }
            const elements: HTMLElement[] = this.createCollection(group.collections, group.orientation
                , group.id, group.header, group.enableGroupOverflow, tabIndex, groupContainer);
            append(elements, groupContent);
            if ((this.activeLayout === 'Simplified') && !(group.enableGroupOverflow || groupEle.querySelector('.' + constants.RIBBON_ITEM))) {
                groupEle.classList.add('e-ribbon-emptyCollection');
            }
        }
        return groupElements;
    }

    private validateItemSize(): void {
        for (let k: number = 0; k < this.tabs.length; k++) {
            const groupList: RibbonGroupModel[] = this.tabs[parseInt(k.toString(), 10)].groups;
            for (let l: number = 0; l < groupList.length; l++) {
                const collectionList: RibbonCollectionModel[] = groupList[parseInt(l.toString(), 10)].collections;
                const alignType: string = groupList[parseInt(l.toString(), 10)].orientation;
                for (let i: number = 0; i < collectionList.length; i++) {
                    const items: RibbonItemModel[] = collectionList[parseInt(i.toString(), 10)].items;
                    for (let j: number = 0; j < items.length; j++) {
                        const ribbonitem: RibbonItemModel = items[parseInt(j.toString(), 10)];
                        if (!ribbonitem.allowedSizes || (ribbonitem.allowedSizes === 0)) {
                            (ribbonitem as RibbonItem).setProperties({
                                allowedSizes:
                                    (RibbonItemSize.Small | RibbonItemSize.Medium | RibbonItemSize.Large)
                            }, true);
                        }
                        if ((ribbonitem.type === 'ColorPicker') && (ribbonitem.allowedSizes !== RibbonItemSize.Small)) {
                            (ribbonitem as RibbonItem).setProperties({ allowedSizes: RibbonItemSize.Small }, true);
                        } else if ((ribbonitem.type === 'ComboBox' || ribbonitem.type === 'CheckBox') &&
                            (ribbonitem.allowedSizes !== RibbonItemSize.Medium)) {
                            (ribbonitem as RibbonItem).setProperties({ allowedSizes: RibbonItemSize.Medium }, true);
                        } else if (((alignType === 'Column') && (items.length > 1)) || ((alignType === 'Row') && (collectionList.length > 1))) {
                            if (ribbonitem.allowedSizes & RibbonItemSize.Large) {
                                // To remove large size, perform 'and' with 011(3).
                                let sizeVal: RibbonItemSize = ribbonitem.allowedSizes & (RibbonItemSize.Small | RibbonItemSize.Medium);
                                sizeVal = sizeVal ? sizeVal : RibbonItemSize.Medium;
                                (ribbonitem as RibbonItem).setProperties({ allowedSizes: sizeVal }, true);
                            }
                        }
                        const itemsize: RibbonItemSize = (ribbonitem.allowedSizes & RibbonItemSize.Large) ? RibbonItemSize.Large :
                            (ribbonitem.allowedSizes & RibbonItemSize.Medium) ? RibbonItemSize.Medium : RibbonItemSize.Small;
                        (ribbonitem as RibbonItem).setProperties({ activeSize: itemsize }, true);
                    }
                }
            }
        }
    }

    private createCollection(collectionList: RibbonCollectionModel[], alignType: string, groupId: string, groupHeader: string
        , isGroupOF: boolean, tabIndex: number, groupContainer?: HTMLElement): HTMLElement[] {
        const collectionElements: HTMLElement[] = [];
        for (let i: number = 0; i < collectionList.length; i++) {
            const collection: RibbonCollectionModel = collectionList[parseInt(i.toString(), 10)];
            const collectionEle: HTMLElement = this.createElement('div', {
                className: collection.cssClass,
                id: collection.id
            });
            collectionEle.classList.add(constants.RIBBON_COLLECTION);
            collectionEle.classList.add(((alignType !== 'Column') || (this.activeLayout === 'Simplified')) ?
                constants.RIBBON_COLUMN : constants.RIBBON_ROW);
            collectionElements.push(collectionEle);
            const elements: HTMLElement[] = this.createItems(collection.items, alignType, groupId
                , groupHeader, isGroupOF, tabIndex, groupContainer);
            append(elements, collectionEle);
            if ((alignType === 'Row') && (i === 2)) { break; }
        }
        return collectionElements;
    }

    private createItems(itemList: RibbonItemModel[], alignType: string, groupId: string, groupHeader: string
        , isGroupOF: boolean, tabIndex: number, groupContainer?: HTMLElement): HTMLElement[] {
        const itemElements: HTMLElement[] = [];
        for (let i: number = 0; i < itemList.length; i++) {
            let item: RibbonItemModel = itemList[parseInt(i.toString(), 10)];
            //To stop rendering of items with simplified mode position type as none
            let flag: boolean = true;
            while ((this.activeLayout === 'Simplified') && (flag) && (item.displayOptions === DisplayMode.None)) {
                i++;
                if (i < itemList.length) { item = itemList[parseInt(i.toString(), 10)]; } else { flag = false; }
            }
            if (!flag) { break; }
            const itemEle: HTMLElement = this.createElement('div', {
                className: item.cssClass,
                id: item.id + constants.CONTAINER_ID
            });
            itemEle.classList.add(constants.RIBBON_ITEM, ...(item.disabled ? [constants.DISABLED_CSS] : []));
            // To avoid undefined items condition is added
            if (item.ribbonTooltipSettings && isTooltipPresent(item.ribbonTooltipSettings)) {
                itemEle.classList.add(constants.RIBBON_TOOLTIP_TARGET);
                this.tooltipData.push({ id: itemEle.id, data: item.ribbonTooltipSettings });
            }
            let size: RibbonItemSize = item.activeSize;
            if (this.activeLayout === 'Simplified') {
                size = ((item.allowedSizes === RibbonItemSize.Large) || (item.allowedSizes & RibbonItemSize.Medium) ||
                    (item.displayOptions === DisplayMode.Overflow)) ? RibbonItemSize.Medium : RibbonItemSize.Small;
                (item as RibbonItem).setProperties({ activeSize: size }, true);
            }
            if (size & RibbonItemSize.Large) {
                itemEle.classList.add(constants.RIBBON_LARGE_ITEM, constants.RIBBON_CONTENT_HEIGHT);
            } else {
                itemEle.classList.add((size & RibbonItemSize.Medium) ? constants.RIBBON_MEDIUM_ITEM : constants.RIBBON_SMALL_ITEM);
            }
            switch (item.type) {
            case 'Button':
                this.ribbonButtonModule.createButton(item, itemEle);
                break;
            case 'DropDown':
                this.ribbonDropDownModule.createDropDown(item, itemEle);
                break;
            case 'SplitButton':
                this.ribbonSplitButtonModule.createSplitButton(item, itemEle);
                break;
            case 'CheckBox':
                this.ribbonCheckBoxModule.createCheckBox(item, itemEle);
                break;
            case 'ColorPicker':
                this.ribbonColorPickerModule.createColorPicker(item, itemEle);
                break;
            case 'ComboBox':
                this.ribbonComboBoxModule.createComboBox(item, itemEle);
                break;
            case 'Template':
                this.createTemplateContent(item, itemEle);
                break;
            }
            if ((this.activeLayout === 'Simplified') && (item.displayOptions === DisplayMode.Overflow)) {
                this.createOverflowPopup(item, tabIndex, isGroupOF, groupId, groupHeader, itemEle, groupContainer);
                if ((item.type === RibbonItemType.DropDown) || (item.type === RibbonItemType.SplitButton)) {
                    this.updatePopupItems(item, itemEle, isGroupOF, true);
                }
            } else {
                // For normal mode and Simplified mode position type as Group and Auto
                itemElements.push(itemEle);
            }
            if ((alignType === 'Column') && (i === 2)) { break; }
        }
        return itemElements;
    }

    private createHelpPaneTemplate(): void {
        if (this.helpPaneTemplate) {
            const templateName: string = 'helpPaneTemplate';
            this.clearTemplate([templateName]);
            this.ribbonTempEle = this.createElement('div', {
                className: constants.RIBBON_HELP_TEMPLATE,
                id: this.element.id + constants.RIBBON_HELP_PANE_TEMPLATE_ID
            });
            const templateFunction: Function = getTemplateFunction(this.helpPaneTemplate);
            append(templateFunction({}, this, templateName, 'helpPaneTemplate', this.isStringTemplate), this.ribbonTempEle);
            const tabEle: HTMLElement = this.tabObj.element;
            const toolbarEle: HTMLElement = tabEle.querySelector('.e-toolbar');
            toolbarEle.after(this.ribbonTempEle);
            tabEle.style.setProperty(constants.RIBBON_HELP_PANE_TEMPLATE_WIDTH, this.ribbonTempEle.offsetWidth + 'px');
            this.renderReactTemplates();
        }
    }

    private createTemplateContent(item: RibbonItemModel, itemElement: HTMLElement): void {
        const itemEle: HTMLElement = this.createElement('div', {
            className: item.cssClass ? (constants.RIBBON_TEMPLATE + constants.SPACE + item.cssClass) : constants.RIBBON_TEMPLATE,
            id: item.id
        });
        if (item.disabled) {
            itemEle.classList.add(constants.DISABLED_CSS);
            itemEle.setAttribute('disabled', '');
        }
        itemElement.appendChild(itemEle);
        this.renderItemTemplate(item, itemEle);
    }

    private renderItemTemplate(item: RibbonItemModel, itemElement: HTMLElement): void {
        const templateName: string = 'ribbon' + item.id + 'itemTemplate';
        this.clearTemplate([templateName]);
        const templateFunction: Function = getTemplateFunction(item.itemTemplate);
        append(templateFunction({ activeSize: RibbonItemSize[item.activeSize] }, this, templateName, (item.id + 'itemTemplate'), this.isStringTemplate), itemElement);
        this.renderReactTemplates();
    }

    private checkID(list: ribbonItemPropsList[], type: string, initId: string): ribbonItemPropsList[] {
        const key: string = type === 'tab' ? constants.TAB_ID : type === 'group' ? constants.GROUP_ID :
            type === 'collection' ? constants.COLLECTION_ID : constants.ITEM_ID;
        for (let i: number = 0; i < list.length; i++) {
            const listitem: ribbonItemPropsList = list[parseInt(i.toString(), 10)];
            if (!listitem.id) { listitem.setProperties({ id: initId + key + (this.idIndex++) }, true); }
            switch (type) {
            case 'tab':
                listitem.setProperties({ groups: this.checkID(listitem.groups, 'group', listitem.id) }, true);
                break;
            case 'group':
                listitem.setProperties({ collections: this.checkID(listitem.collections, 'collection', listitem.id) }, true);
                break;
            case 'collection':
                listitem.setProperties({ items: this.checkID(listitem.items, 'item', listitem.id) }, true);
                break;
            default:
                break;
            }
        }
        return list;
    }

    private updateCommonProperty(commonProp: commonProperties): void {
        this.tabObj.setProperties(commonProp);
        if (this.ribbonFileMenuModule) {
            this.ribbonFileMenuModule.setCommonProperties(commonProp);
        }
        for (let i: number = 0; i < this.tabs.length; i++) {
            const tab: RibbonTabModel = this.tabs[parseInt(i.toString(), 10)];
            const contentEle: HTMLElement = this.tabObj.items[parseInt(i.toString(), 10)].content as HTMLElement;
            for (const group of tab.groups) {
                let dropdownElement: HTMLElement;
                let dropdown: DropDownButton;
                if (this.activeLayout === RibbonLayout.Classic) {
                    dropdownElement = group.isCollapsed ?
                        contentEle.querySelector('#' + group.id + constants.OVERFLOW_ID + constants.DROPDOWN_ID) : null;
                } else {
                    dropdownElement = group.enableGroupOverflow ?
                        contentEle.querySelector('#' + group.id + constants.GROUPOF_BUTTON_ID) : null;
                    dropdown = dropdownElement ? getComponent(dropdownElement, DropDownButton) : this.overflowDDB;
                    if (dropdown) {
                        updateTooltipProp(dropdown.target as HTMLElement, commonProp);
                        dropdown.setProperties(commonProp);
                    }
                }
                for (const collection of group.collections) {
                    for (const item of collection.items) {
                        let ele: HTMLElement = null;
                        if (this.activeLayout === RibbonLayout.Classic) {
                            ele = dropdownElement ? this.ribbonDropDownModule.getDDBItemElement(dropdownElement, item.id) : contentEle.querySelector('#' + item.id);
                        } else {
                            //Checks for Simplified and Auto options (Auto = simplified + popup)
                            ele = (item.displayOptions & DisplayMode.Simplified) ? contentEle.querySelector('#' + item.id) : null;
                            // element will be null for "Popup" and if the item is moved to overflow in "Auto" mode
                            if (!ele && (item.displayOptions !== DisplayMode.None)) {
                                ele = (dropdown.target as HTMLElement).querySelector('#' + item.id);
                                if (item.type === 'DropDown') {
                                    this.updatePopupItems(item, dropdown.target as HTMLElement, group.enableGroupOverflow, true);
                                }
                            }
                        }
                        if (ele) {
                            const moduleName: string = this.getItemModuleName(item);
                            if (moduleName !== 'template') {
                                updateCommonProperty(ele, moduleName, commonProp);
                            } else if (!isNullOrUndefined(commonProp.enableRtl)) {
                                ele.classList.toggle(constants.RTL_CSS, commonProp.enableRtl);
                            }
                        }
                    }
                }
            }
        }
    }

    private removeLauncherIcon(groupId: string, dropdownElement: HTMLElement, contentEle: HTMLElement): void {
        const containerId: string = groupId + constants.CONTAINER_ID;
        const containerEle: HTMLElement = dropdownElement ? this.ribbonDropDownModule.getDDBItemElement(dropdownElement, containerId) : contentEle.querySelector('#' + containerId);
        if (containerEle) {
            containerEle.classList.remove(constants.RIBBON_LAUNCHER);
            const launcherIcon: HTMLElement = containerEle.querySelector('#' + groupId + constants.LAUNCHER_ID);
            remove(launcherIcon);
        }
    }

    private destroyTabItems(tabs: RibbonTabModel[]): void {
        for (let i: number = 0; i < tabs.length; i++) {
            const tab: RibbonTabModel = tabs[parseInt(i.toString(), 10)];
            const contentEle: HTMLElement = this.tabObj.items[parseInt(i.toString(), 10)].content as HTMLElement;
            for (const group of tab.groups) {
                let dropdownElement: HTMLElement;
                let dropdown: DropDownButton;
                if (this.activeLayout === RibbonLayout.Classic) {
                    dropdownElement = group.isCollapsed ?
                        contentEle.querySelector('#' + group.id + constants.OVERFLOW_ID + constants.DROPDOWN_ID) : null;
                    if (group.showLauncherIcon) {
                        this.removeLauncherIcon(group.id, dropdownElement, contentEle);
                    }
                } else {
                    dropdownElement = group.enableGroupOverflow ?
                        contentEle.querySelector('#' + group.id + constants.GROUPOF_BUTTON_ID) : null;
                    dropdown = dropdownElement ? getComponent(dropdownElement, DropDownButton) : this.overflowDDB;
                }
                for (const collection of group.collections) {
                    for (const item of collection.items) {
                        let ele: HTMLElement;
                        if (this.activeLayout === RibbonLayout.Classic) {
                            ele = dropdownElement ? this.ribbonDropDownModule.getDDBItemElement(dropdownElement, item.id) :
                                contentEle.querySelector('#' + item.id);
                        } else {
                            //Checks for Simplified and Auto options (Auto = simplified + popup)
                            ele = (item.displayOptions & DisplayMode.Simplified) ?
                                contentEle.querySelector('#' + item.id) : null;
                            // element will be null for "Popup" and if the item is moved to overflow in "Auto" mode
                            if (!ele && (item.displayOptions !== DisplayMode.None)) {
                                ele = dropdown ? (dropdown.target as HTMLElement).querySelector('#' + item.id) : null;
                            }
                        }
                        if (ele) {
                            this.destroyFunction(item, ele);
                        }
                    }
                }
                if ((this.activeLayout === RibbonLayout.Classic) && dropdownElement) {
                    this.ribbonDropDownModule.removeOverFlowDropDown(dropdownElement);
                } else if ((this.activeLayout === RibbonLayout.Simplified) && group.enableGroupOverflow && dropdownElement) {
                    this.removeOverflowButton(dropdown);
                }
            }
        }
        if (this.overflowDDB) {
            this.removeOverflowButton(this.overflowDDB);
            this.overflowDDB = null;
        }
    }

    private destroyFunction(item: RibbonItemModel, ele: HTMLElement): void {
        const moduleName: string = this.getItemModuleName(item);
        if (moduleName === 'colorpicker') {
            this.ribbonColorPickerModule.unwireColorPickerEvents(ele);
        } else if (moduleName !== 'template') {
            destroyControl(ele, moduleName);
        }
        if (item.ribbonTooltipSettings) {
            const index: number = getIndex(this.tooltipData, (e: RibbonItemModel) => { return e.id === item.id + constants.CONTAINER_ID; });
            if (index !== -1) {
                this.tooltipData.splice(index, 1);
            }
        }
    }

    private getItemModuleName(item: RibbonItemModel): string {
        switch (item.type) {
        case 'Button':
            return 'btn';
        case 'DropDown':
            return 'dropdown-btn';
        case 'SplitButton':
            return 'split-btn';
        case 'CheckBox':
            return 'checkbox';
        case 'ColorPicker':
            return 'colorpicker';
        case 'ComboBox':
            return 'combobox';
        default:
            return 'template';
        }
    }

    private clearOverflowResize(): void {
        this.destroyScroll();
        this.clearOverflowDropDown(this.selectedTab);
        const tab: RibbonTabModel = this.tabs[this.selectedTab];
        const activeContent: HTMLElement = this.tabObj.element.querySelector('#' + this.tabs[this.selectedTab].id + constants.CONTENT_ID);
        const tabContent: HTMLElement = activeContent.closest('.' + constants.TAB_CONTENT) as HTMLElement;
        for (let j: number = 0; (j < tab.groups.length); j++) {
            this.checkSmallToMedium(this.selectedTab, tab, j, tabContent, activeContent, true, true);
            this.checkMediumToLarge(this.selectedTab, tab, j, tabContent, activeContent, true, true);
        }
    }

    /**
     * Refreshes the layout.
     *
     * @returns {void}
     */
    public refreshLayout(): void {
        this.resizeHandler();
    }
    /**
     * Selects the tab
     *
     * @param  {string} tabId - Gets the tab ID
     * @returns {void}
     */
    public selectTab(tabId: string): void {
        const index: number = getIndex(this.tabs, (e: RibbonTab) => { return e.id === tabId; });
        this.setProperties({ selectedTab: index });
    }

    /**
     * Adds the ribbon tab.
     *
     * @param {RibbonTabModel} tab - Gets the ribbon tab model
     * @param {string} targetId  - Gets the ID of the target tab to add the new tab.
     * @param {boolean} isAfter - Defines whether the tab is added before or after the target.
     * @returns {void}
     */
    public addTab(tab: RibbonTabModel, targetId?: string, isAfter?: boolean): void {
        let index: number = targetId ? getIndex(this.tabs, (e: RibbonTabModel) => e.id === targetId) : -1;
        index = (index === -1) ? this.tabs.length : (index + (isAfter ? 1 : 0));
        this.tabsInternal = this.tabs.slice();
        this.tabsInternal.splice(index, 0, tab);
        this.setProperties({ tabs: this.tabsInternal }, true);
        this.checkID([this.tabs[parseInt(index.toString(), 10)]], 'tab', this.element.id);
        this.tabsInternal = this.tabs.slice();
        this.validateItemSize();
        const tabItem: TabItemModel[] = this.createTabItems([tab]);
        this.tabObj.addTab(tabItem, index);
    }

    /**
     * Removes the ribbon tab.
     *
     * @param {string} tabId - Gets the tab ID
     * @returns {void}
     */
    public removeTab(tabId: string): void {
        const index: number = getIndex(this.tabs, (e: RibbonTab) => { return e.id === tabId; });
        if (index === -1) { return; }
        const contentEle: HTMLElement = this.tabObj.items[parseInt(index.toString(), 10)].content as HTMLElement;
        const groups: RibbonGroupModel[] = this.tabs[parseInt(index.toString(), 10)].groups;
        if (groups && (contentEle.innerHTML !== '')) {
            for (const group of groups) {
                const dropdownElement: HTMLElement = group.isCollapsed ? contentEle.querySelector('#' + group.id + constants.OVERFLOW_ID + constants.DROPDOWN_ID) : null;
                for (const collection of group.collections) {
                    for (const item of collection.items) {
                        const ele: HTMLElement = dropdownElement ? this.ribbonDropDownModule.getDDBItemElement(dropdownElement, item.id) : contentEle.querySelector('#' + item.id);
                        if (ele) {
                            this.destroyFunction(item, ele);
                        }
                    }
                }
                if (dropdownElement) { this.ribbonDropDownModule.removeOverFlowDropDown(dropdownElement); }
            }
        }
        if (index === this.selectedTab) {
            this.isAddRemove = true;
        }
        this.tabsInternal = this.tabs.slice();
        this.tabsInternal.splice(index, 1);
        this.setProperties({ tabs: this.tabsInternal }, true);
        this.tabObj.removeTab(index);
    }

    /**
     * Adds the ribbon group.
     *
     * @param {string} tabId - Gets the tab ID.
     * @param {RibbonGroupModel} group - Gets the ribbon group model.
     * @param {string} targetId - Gets the ID of the target group to add the new group.
     * @param {boolean} isAfter - Defines whether the group is added before or after the target.
     * @returns {void}
     */
    public addGroup(tabId: string, group: RibbonGroupModel, targetId?: string, isAfter?: boolean): void {
        const tabIndex: number = getIndex(this.tabs, (e: RibbonTab) => { return e.id === tabId; });
        if (tabIndex === -1) { return; }
        if (this.selectedTab === tabIndex) { this.clearOverflowResize(); }
        const tab: RibbonTabModel = this.tabs[parseInt(tabIndex.toString(), 10)];
        const ribbonGroups: RibbonGroupModel[] = tab.groups.slice();
        let index: number = targetId ? getIndex(ribbonGroups, (e: RibbonGroupModel) => { return e.id === targetId; }) : -1;
        index = (index === -1) ? ribbonGroups.length : (index + (isAfter ? 1 : 0));
        ribbonGroups.splice(index, 0, group);
        (tab as RibbonTab).setProperties({ groups: ribbonGroups }, true);
        this.checkID([tab.groups[parseInt(index.toString(), 10)]], 'group', tabId);
        this.validateItemSize();
        //Check whether the tab items are rendered
        const contentEle: HTMLElement = this.tabObj.items[parseInt(tabIndex.toString(), 10)].content as HTMLElement;
        if (contentEle.innerHTML !== '') {
            const element: HTMLElement = this.createGroups([tab.groups[parseInt(index.toString(), 10)]], tabIndex)[0];
            //insert the element in tab items property.
            const targetEle: HTMLElement = targetId ? contentEle.querySelector('#' + targetId) : null;
            if (targetEle) {
                targetEle.insertAdjacentElement(isAfter ? 'afterend' : 'beforebegin', element);
            } else {
                contentEle.append(element);
            }
        }
        if (this.selectedTab === tabIndex) { this.refreshLayout(); }
    }

    /**
     * Removes the ribbon group.
     *
     * @param {string} groupId -Gets the group ID.
     * @returns {void}
     */
    public removeGroup(groupId: string): void {
        const itemProp: itemProps = getGroup(this.tabs, groupId);
        if (!itemProp) { return; }
        if (this.selectedTab === itemProp.tabIndex) { this.clearOverflowResize(); }
        //Check whether the tab items are rendered
        const contentEle: HTMLElement = this.tabObj.items[itemProp.tabIndex].content as HTMLElement;
        if (contentEle.innerHTML !== '') {
            let dropdownElement: HTMLElement;
            let dropdown: DropDownButton;
            if (itemProp.group.showLauncherIcon) { this.removeLauncherIcon(itemProp.group.id, null, contentEle); }
            if (this.activeLayout === RibbonLayout.Simplified) {
                dropdownElement = itemProp.group.enableGroupOverflow ?
                    contentEle.querySelector('#' + itemProp.group.id + constants.GROUPOF_BUTTON_ID) : null;
                dropdown = dropdownElement ? getComponent(dropdownElement, DropDownButton) : this.overflowDDB;
            }
            for (const collection of itemProp.group.collections) {
                for (const item of collection.items) {
                    this.removeItemElement(contentEle, item, dropdown);
                }
            }
            if (this.activeLayout === RibbonLayout.Simplified) {
                if (itemProp.group.enableGroupOverflow) {
                    if ((dropdown.target as HTMLElement).childElementCount === 0) { this.removeOverflowButton(dropdown); }
                } else {
                    const ofGroupContainer: HTMLElement = (dropdown.target as HTMLElement).querySelector('#' + itemProp.group.id + constants.CONTAINER_ID);
                    if (ofGroupContainer && ofGroupContainer.childElementCount === 1) { ofGroupContainer.remove(); }
                    const ofTabContainer: HTMLElement = (dropdown.target as HTMLElement).querySelector('#' + this.tabs[parseInt(itemProp.tabIndex.toString(), 10)].id + constants.OVERFLOW_ID);
                    if (ofTabContainer && ofTabContainer.childElementCount === 0) { ofTabContainer.remove(); }
                }
            }
            const groupEle: HTMLElement = contentEle.querySelector('#' + groupId);
            if (groupEle) { groupEle.remove(); }
        }
        const ribbonGroups: RibbonGroupModel[] = this.tabs[itemProp.tabIndex].groups.slice();
        ribbonGroups.splice(itemProp.groupIndex, 1);
        (this.tabs[itemProp.tabIndex] as RibbonTab).setProperties({ groups: ribbonGroups }, true);
        if (this.selectedTab === itemProp.tabIndex) { this.refreshLayout(); }
    }

    /**
     * adds the ribbon collection.
     *
     * @param {string} groupId - Gets the ribbon group ID.
     * @param {RibbonCollectionModel} collection - Gets the ribbon collection model.
     * @param {string} targetId - Gets the ID of the target collection to add the new collection.
     * @param {boolean} isAfter - Defines whether the collection is added before or after the target.
     * @returns {void}
     */
    public addCollection(groupId: string, collection: RibbonCollectionModel, targetId?: string, isAfter?: boolean): void {
        const itemProp: itemProps = getGroup(this.tabs, groupId);
        if (!itemProp) { return; }
        if ((itemProp.group.orientation === 'Row') && (itemProp.group.collections.length === 3)) { return; }
        if (this.selectedTab === itemProp.tabIndex) { this.clearOverflowResize(); }
        const ribbonCollections: RibbonCollectionModel[] = itemProp.group.collections.slice();
        let index: number = targetId ? getIndex(ribbonCollections, (e: RibbonCollectionModel) => { return e.id === targetId; }) : -1;
        index = (index === -1) ? ribbonCollections.length : (index + (isAfter ? 1 : 0));
        ribbonCollections.splice(index, 0, collection);
        (itemProp.group as RibbonGroup).setProperties({ collections: ribbonCollections }, true);
        this.checkID([itemProp.group.collections[parseInt(index.toString(), 10)]], 'collection', groupId);
        this.validateItemSize();
        let contentEle: HTMLElement = this.tabObj.items[itemProp.tabIndex].content as HTMLElement;
        if (contentEle.innerHTML !== '') {
            const collection: RibbonCollectionModel = itemProp.group.collections[parseInt(index.toString(), 10)];
            const element: HTMLElement = this.createCollection([collection], itemProp.group.orientation, itemProp.group.id
                , itemProp.group.header, itemProp.group.enableGroupOverflow, itemProp.tabIndex)[0];
            if (itemProp.group.isCollapsed) {
                contentEle = this.ribbonDropDownModule.getOverflowDropDownPopup(itemProp, contentEle);
            }
            //insert the element in tab items property.
            const targetEle: HTMLElement = targetId ? contentEle.querySelector('#' + targetId) : null;
            if (targetEle) {
                targetEle.insertAdjacentElement(isAfter ? 'afterend' : 'beforebegin', element);
            } else {
                contentEle.querySelector('#' + groupId + constants.CONTENT_ID).append(element);
            }
        }
        if (this.selectedTab === itemProp.tabIndex) { this.refreshLayout(); }
    }

    /**
     * Removes the ribbon collection.
     *
     * @param {string} collectionId - Gets the collection ID.
     * @returns {void}
     */
    public removeCollection(collectionId: string): void {
        const itemProp: itemProps = getCollection(this.tabs, collectionId);
        if (!itemProp) { return; }
        if (this.selectedTab === itemProp.tabIndex) { this.clearOverflowResize(); }
        //Check whether the tab items are rendered
        const contentEle: HTMLElement = this.tabObj.items[itemProp.tabIndex].content as HTMLElement;
        if (contentEle.innerHTML !== '') {
            let dropdownElement: HTMLElement;
            let dropdown: DropDownButton;
            if (this.activeLayout === RibbonLayout.Simplified) {
                dropdownElement = itemProp.group.enableGroupOverflow ?
                    contentEle.querySelector('#' + itemProp.group.id + constants.GROUPOF_BUTTON_ID) : null;
                dropdown = dropdownElement ? getComponent(dropdownElement, DropDownButton) : this.overflowDDB;
            }
            for (const item of itemProp.collection.items) {
                this.removeItemElement(contentEle, item, dropdown);
            }
            const groupEle: HTMLElement = contentEle.querySelector('#' + collectionId);
            if (groupEle) { groupEle.remove(); }
        }
        const ribbonGroup: RibbonGroup = itemProp.group as RibbonGroup;
        const ribbonCollections: RibbonCollectionModel[] = ribbonGroup.collections.slice();
        ribbonCollections.splice(itemProp.collectionIndex, 1);
        ribbonGroup.setProperties({ collections: ribbonCollections }, true);
        if (this.selectedTab === itemProp.tabIndex) { this.refreshLayout(); }
    }

    /**
     * Adds ribbon item.
     *
     * @param {string} collectionId - Gets the collection ID.
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @param {string} targetId - Gets the ID of the target item to add the new item.
     * @param {boolean} isAfter - Defines whether the item is added before or after the target.
     * @returns {void}
     */
    public addItem(collectionId: string, item: RibbonItemModel, targetId?: string, isAfter?: boolean): void {
        const itemProp: itemProps = getCollection(this.tabs, collectionId);
        if (!itemProp) { return; }
        if ((itemProp.group.orientation === 'Column') && (itemProp.collection.items.length === 3)) { return; }
        if (this.selectedTab === itemProp.tabIndex) { this.clearOverflowResize(); }
        const ribbonItems: RibbonItemModel[] = itemProp.collection.items.slice();
        let index: number = targetId ? getIndex(ribbonItems, (e: RibbonItemModel) => { return e.id === targetId; }) : -1;
        index = (index === -1) ? ribbonItems.length : (index + (isAfter ? 1 : 0));
        ribbonItems.splice(index, 0, item);
        (itemProp.collection as RibbonCollection).setProperties({ items: ribbonItems }, true);
        this.checkID([itemProp.collection.items[parseInt(index.toString(), 10)]], 'item', collectionId);
        this.validateItemSize();
        let contentEle: HTMLElement = this.tabObj.items[itemProp.tabIndex].content as HTMLElement;
        const groupContainer: HTMLElement = contentEle.querySelector('#' + itemProp.group.id + constants.CONTAINER_ID);
        if (contentEle.innerHTML !== '') {
            const item: RibbonItemModel = itemProp.collection.items[parseInt(index.toString(), 10)];
            const element: HTMLElement = this.createItems([item], itemProp.group.orientation, itemProp.group.id, itemProp.group.header
                , itemProp.group.enableGroupOverflow, itemProp.tabIndex, groupContainer)[0];
            if (itemProp.group.isCollapsed) {
                contentEle = this.ribbonDropDownModule.getOverflowDropDownPopup(itemProp, contentEle);
            }
            //insert the element in tab items property.
            const targetEle: HTMLElement = targetId ? contentEle.querySelector('#' + targetId) : null;
            if (targetEle) {
                targetEle.closest('.' + constants.RIBBON_ITEM).insertAdjacentElement(isAfter ? 'afterend' : 'beforebegin', element);
            } else {
                if (element) { contentEle.querySelector('#' + collectionId).append(element); }
            }
        }
        if (this.selectedTab === itemProp.tabIndex) { this.refreshLayout(); }
    }

    /**
     * Removes ribbon item.
     *
     * @param {string} itemId - Gets the item ID.
     * @returns {void}
     */
    public removeItem(itemId: string): void {
        const itemProp: itemProps = getItem(this.tabs, itemId);
        if (!itemProp) { return; }
        if (this.selectedTab === itemProp.tabIndex) { this.clearOverflowResize(); }
        //Check whether the tab items are rendered
        const contentEle: HTMLElement = this.tabObj.items[itemProp.tabIndex].content as HTMLElement;
        if (contentEle.innerHTML !== '') {
            let dropdownElement: HTMLElement;
            let dropdown: DropDownButton;
            if (this.activeLayout === RibbonLayout.Simplified) {
                dropdownElement = itemProp.group.enableGroupOverflow ?
                    contentEle.querySelector('#' + itemProp.group.id + constants.GROUPOF_BUTTON_ID) : null;
                dropdown = dropdownElement ? getComponent(dropdownElement, DropDownButton) : this.overflowDDB;
            }
            const item: RibbonItemModel = itemProp.item;
            this.removeItemElement(contentEle, item, dropdown);
        }
        const ribbonCollection: RibbonCollection = itemProp.collection as RibbonCollection;
        const ribbonItems: RibbonItemModel[] = ribbonCollection.items;
        ribbonItems.splice(itemProp.itemIndex, 1);
        ribbonCollection.setProperties({ items: ribbonItems }, true);
        if (this.selectedTab === itemProp.tabIndex) { this.refreshLayout(); }
    }

    private removeItemElement(contentEle: HTMLElement, item: RibbonItemModel, dropdown: DropDownButton): void {
        let ele: HTMLElement = null;
        if (this.activeLayout === RibbonLayout.Classic) {
            ele = contentEle.querySelector('#' + item.id);
        } else {
            //Checks for Simplified and Auto options (Auto = simplified + popup)
            ele = (item.displayOptions & DisplayMode.Simplified) ? contentEle.querySelector('#' + item.id) : null;
            // element will be null for "Popup" and if the item is moved to overflow in "Auto" mode
            if (!ele && (item.displayOptions !== DisplayMode.None)) {
                ele = (dropdown.target as HTMLElement).querySelector('#' + item.id);
            }
        }
        if (ele) {
            this.destroyFunction(item, ele);
            ele.closest('#' + item.id + constants.CONTAINER_ID).remove();
        }
    }

    /**
     * Enables ribbon item.
     *
     * @param {string} itemId - Gets the item ID.
     * @returns {void}
     */
    public enableItem(itemId: string): void {
        this.enableDisableItem(itemId, false);
    }

    /**
     * Disables ribbon item.
     *
     * @param {string} itemId - Gets the item ID.
     * @returns {void}
     */
    public disableItem(itemId: string): void {
        this.enableDisableItem(itemId, true);
    }

    private enableDisableItem(itemId: string, isDisabled: boolean): void {
        const itemProp: itemProps = getItem(this.tabs, itemId);
        if (!itemProp) { return; }
        (itemProp.item as RibbonItem).setProperties({ disabled: isDisabled }, true);
        const ele: HTMLElement = getItemElement(this, itemId, itemProp);
        if (ele) {
            const itemEle: HTMLElement = closest(ele, '.e-ribbon-item') as HTMLElement;
            itemEle.classList.toggle(constants.DISABLED_CSS, itemProp.item.disabled);
            const moduleName: string = this.getItemModuleName(itemProp.item);
            if (moduleName !== 'template') {
                updateControlDisabled(ele, moduleName, isDisabled);
            } else {
                ele.classList.toggle(constants.DISABLED_CSS, isDisabled);
                ele.toggleAttribute('disabled', isDisabled);
            }
        }
    }

    private unwireEvents(): void {
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'resize', this.resizeHandler);
    }

    public destroy(): void {
        destroyTooltip(this.element);
        this.destroyTabItems(this.tabs);
        this.removeExpandCollapse();
        this.collapseButton = undefined;
        if (this.scrollModule) { this.scrollModule.destroy(); }
        if (this.ribbonTempEle) {
            remove(this.ribbonTempEle);
            this.ribbonTempEle = null;
        }
        super.destroy();
        this.tabObj.destroy();
        this.tabObj = undefined;
        remove(this.element.querySelector('#' + this.element.id + constants.TAB_ID));
        this.element.style.removeProperty(constants.RIBBON_FILE_MENU_WIDTH);
        this.element.style.removeProperty(constants.RIBBON_HELP_PANE_TEMPLATE_WIDTH);
        this.element.style.removeProperty('width');
        if (this.cssClass) { removeClass([this.element], this.cssClass.split(constants.SPACE)); }
        this.element.classList.remove(constants.RTL_CSS, constants.RIBBON_SIMPLIFIED_MODE, constants.RIBBON_OVERFLOW,
                                      constants.RIBBON_COLLAPSIBLE, constants.RIBBON_MINIMIZE, 'e-rbn');
        this.unwireEvents();
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param  {RibbonModel} newProp - Specifies new properties
     * @param  {RibbonModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: RibbonModel, oldProp?: RibbonModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'activeLayout':
                this.switchLayout();
                break;
            case 'cssClass':
                if (oldProp.cssClass) {
                    this.element.classList.remove(...oldProp.cssClass.split(constants.SPACE));
                }
                if (newProp.cssClass) {
                    this.element.classList.add(...newProp.cssClass.split(constants.SPACE));
                }
                break;
            case 'isMinimized':
                this.element.classList.toggle(constants.RIBBON_MINIMIZE, this.isMinimized);
                (this.tabObj.element.querySelector('.e-content') as HTMLElement).style.display = this.isMinimized ? 'none' : 'block';
                break;
            case 'locale':
                this.updateCommonProperty({ locale: this.locale });
                break;
            case 'enablePersistence':
                this.updateCommonProperty({ enablePersistence: this.enablePersistence });
                break;
            case 'enableRtl':
                this.element.classList.toggle(constants.RTL_CSS, this.enableRtl);
                this.updateCommonProperty({ enableRtl: newProp.enableRtl });
                if (this.scrollModule) { this.scrollModule.setProperties({ enableRtl: newProp.enableRtl }); }
                break;
            case 'launcherIconCss':
                for (let i: number = 0; i < this.tabs.length; i++) {
                    const tabContent: HTMLElement = this.tabObj.items[parseInt(i.toString(), 10)].content as HTMLElement;
                    const tab: RibbonTabModel = this.tabs[parseInt(i.toString(), 10)];
                    if (tabContent.querySelector('.' + constants.RIBBON_GROUP)) {
                        for (const group of tab.groups) {
                            if (group.showLauncherIcon) {
                                const className: string = constants.RIBBON_LAUNCHER_ICON_ELE + ' ' + (this.launcherIconCss || constants.RIBBON_LAUNCHER_ICON);
                                if (group.isCollapsed) {
                                    const element: HTMLElement = tabContent.querySelector('.' + constants.RIBBON_GROUP_OVERFLOW_DDB);
                                    const dropdown: DropDownButton = getComponent(element, DropDownButton);
                                    const launcherIconEle: HTMLElement = (dropdown.target as HTMLElement).querySelector('#' + group.id + constants.LAUNCHER_ID);
                                    launcherIconEle.className = className;
                                }
                                else {
                                    const element: HTMLElement = tabContent.querySelector('#' + group.id + constants.LAUNCHER_ID);
                                    element.className = className;
                                }
                            }
                        }
                    }
                }
                break;
            case 'selectedTab':
                this.tabObj.setProperties({ selectedItem: newProp.selectedTab });
                break;
            case 'tabAnimation':
                this.tabObj.setProperties({ animation: newProp.tabAnimation });
                break;
            case 'tabs':
                this.reRenderTabs();
                break;
            case 'width':
                this.element.style.width = formatUnit(newProp.width);
                this.refreshLayout();
                break;
            case 'fileMenu':
                if (this.ribbonFileMenuModule) { this.ribbonFileMenuModule.updateFileMenu(this.fileMenu); }
                break;
            case 'helpPaneTemplate':
                if (this.ribbonTempEle) {
                    remove(this.ribbonTempEle);
                }
                if (this.helpPaneTemplate) {
                    this.createHelpPaneTemplate();
                }
                break;
            }
        }
    }
}
