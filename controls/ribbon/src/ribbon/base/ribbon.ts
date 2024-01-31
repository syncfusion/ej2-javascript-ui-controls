import { addClass, append, Event, Collection, Complex, Component, EmitType, EventHandler, formatUnit, getInstance, getComponent, getUniqueID, closest, KeyboardEventArgs, KeyboardEvents } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, isNullOrUndefined, isUndefined, ModuleDeclaration, NotifyPropertyChanges, Property, remove, removeClass } from '@syncfusion/ej2-base';
import { Tab, TabAnimationSettings, TabAnimationSettingsModel, TabItemModel, SelectEventArgs, SelectingEventArgs, HScroll, Toolbar } from '@syncfusion/ej2-navigations';
import { RibbonTab, RibbonTabModel, RibbonGroupModel, RibbonCollectionModel, RibbonItemModel, FileMenuSettings, FileMenuSettingsModel, BackStageMenu, BackStageMenuModel, RibbonItem, RibbonCollection, RibbonGroup } from '../models/index';
import { RibbonModel } from './ribbon-model';
import { commonProperties, DisplayMode, ExpandCollapseEventArgs, itemProps, LauncherClickEventArgs, OverflowPopupEventArgs, ribbonItemPropsList, RibbonLayout, ribbonTooltipData, TabSelectedEventArgs, TabSelectingEventArgs } from './interface';
import { ItemOrientation, RibbonItemSize, RibbonItemType } from './interface';
import { RibbonButton, RibbonComboBox, RibbonCheckBox, RibbonDropDown, RibbonColorPicker, RibbonSplitButton, RibbonGroupButton } from '../items/index';
import { destroyControl, getCollection, getGroup, getIndex, getItem, getItemElement, updateCommonProperty, updateControlDisabled, isTooltipPresent, getTemplateFunction, createTooltip, destroyTooltip, updateTooltipProp } from './utils';
import * as constants from './constant';
import { RibbonFileMenu, RibbonBackstage } from '../modules/index';
import { RibbonTooltipModel } from '../models/ribbon-tooltip-model';
import { Popup } from '@syncfusion/ej2-popups';
import { BeforeOpenCloseMenuEventArgs, DropDownButton, SplitButton } from '@syncfusion/ej2-splitbuttons';
import { CheckBox } from '@syncfusion/ej2-buttons';

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
     * Defines the properties of ribbon backstage.
     *
     * @default {}
     */
    @Complex<BackStageMenuModel>({}, BackStageMenu)
    public backStageMenu: BackStageMenuModel;

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
     * @angularType string | object | HTMLElement
     * @reactType string | function | JSX.Element | HTMLElement
     * @vueType string | function | HTMLElement
     * @aspType string
     */
    @Property('')
    public helpPaneTemplate: string | HTMLElement | Function;

    /**
     * Defines whether to show the layout switcher button or not.
     *
     * @default false
     */
    @Property(false)
    public hideLayoutSwitcher: boolean;

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
     * Event triggers once the Ribbon Component rendering is completed.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Event triggers when the overflow popup opens.
     *
     * @event overflowPopupOpen
     */
    @Event()
    public overflowPopupOpen: EmitType<OverflowPopupEventArgs>;

    /**
     * Event triggers when the overflow popup closes.
     *
     * @event overflowPopupClose
     */
    @Event()
    public overflowPopupClose: EmitType<OverflowPopupEventArgs>;
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

    /**
     * The `ribbonBackstageModule` is used to create and manipulate the ribbon backstage.
     */
    public ribbonBackstageModule: RibbonBackstage

    /**
     * The `ribbonGroupButtonModule` is used to create and manipulate group button in ribbon item.
     */
    public ribbonGroupButtonModule: RibbonGroupButton;

    private itemIndex: number;
    private idIndex: number;
    private isAddRemove: boolean;
    private collapseButton: HTMLElement;
    private ribbonTempEle: HTMLElement;
    private scrollModule: HScroll;
    private currentControlIndex: number;
    private keyboardModuleRibbon: KeyboardEvents;
    private keyConfigs: { [key: string]: string };
    private initialPropsData: {[key: string]: object};
    private hiddenElements: {[key: string]: object};
    private hiddenGroups: string[];
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
        Ribbon.Inject(RibbonButton, RibbonCheckBox, RibbonDropDown, RibbonSplitButton, RibbonComboBox, RibbonGroupButton);
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
        this.initialPropsData = {};
        this.hiddenElements = {};
        this.hiddenGroups = [];
        this.isAddRemove = false;
        this.keyConfigs = {
            leftarrow: 'leftarrow',
            rightarrow: 'rightarrow',
            tab: 'tab',
            shiftTab: 'shift+tab'
        };
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
            { member: 'ribbonGroupButton', args: [this] },
            { member: 'ribbonFileMenu', args: [this] },
            { member: 'ribbonBackstage', args: [this] });
        return modules;
    }

    private initialize(): void {
        this.element.id = this.element.id || getUniqueID('e-' + this.getModuleName());
        addClass([this.element], ['e-rbn', ...(this.cssClass ? this.cssClass.split(constants.SPACE) : [])]);
        if (this.enableRtl) { this.element.classList.add(constants.RTL_CSS); }
        this.element.style.width = formatUnit(this.width);
        this.renderTabs();
        if (this.ribbonFileMenuModule) { this.ribbonFileMenuModule.createFileMenu(this.fileMenu); }
        if (this.ribbonBackstageModule) { this.ribbonBackstageModule.createBackStage(this.backStageMenu); }
        this.createHelpPaneTemplate();
        const toolbar: Toolbar = this.tabObj['tbObj'] as Toolbar;
        toolbar.refreshOverflow();
        createTooltip(this.element, this);
        this.wireEvents();
        this.wireKeyboardEvent();
        this.currentControlIndex = 0;
    }

    private wireEvents(): void {
        EventHandler.add(<HTMLElement & Window><unknown>window, 'resize', this.resizeHandler, this);
    }

    private wireKeyboardEvent(): void {
        this.keyboardModuleRibbon = new KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        if (((e.key === 'Tab') && (!((e.target as HTMLElement).classList.contains('e-tab-wrap')) && !((e.target as HTMLElement).classList.contains('e-combobox'))))) {
            e.preventDefault();
        }
        const activeContent: HTMLElement = this.tabObj.element.querySelector('#' + this.tabs[this.selectedTab].id + constants.CONTENT_ID);
        const controlElements: Array<Element> = Array.prototype.slice.call(activeContent.querySelectorAll('.e-control'));
        const templateElements: Array<Element> =  Array.prototype.slice.call(activeContent.querySelectorAll('.e-ribbon-template'));
        const ribbonControls = controlElements.concat(templateElements);
        const comboBoxElements: NodeListOf<Element> = activeContent.querySelectorAll('.e-combobox');
        let comboBoxEle: HTMLElement;
        if (comboBoxElements) {
            for (let i: number = 0; i < comboBoxElements.length; i++) {
                if (comboBoxElements[parseInt(i.toString(), 10)].closest('.e-input-focus')) {
                    comboBoxEle = comboBoxElements[parseInt(i.toString(), 10)] as HTMLElement;
                }
            }
        }
        if (comboBoxEle) {
            for (let i: number = 0; i < ribbonControls.length; i++) {
                if (ribbonControls[parseInt(i.toString(), 10)].classList.contains('e-combobox')) {
                    if (ribbonControls[parseInt(i.toString(), 10)].closest('.e-input-focus')) {
                        this.currentControlIndex = i;
                    }
                }
            }
        }
        if (this.currentControlIndex === 0) {
            let item: HTMLElement = ribbonControls[this.currentControlIndex].closest('.e-ribbon-item') as HTMLElement;
            while (item && item.classList.contains('e-disabled')) {
                this.currentControlIndex++;
                item = ribbonControls[this.currentControlIndex].closest('.e-ribbon-item') as HTMLElement;
            }
        }
        if ((e.target as HTMLElement).classList.contains('e-control') || (e.target as HTMLElement).classList.contains('e-ribbon-launcher-icon') ||
                (e.target as HTMLElement).classList.contains('e-ribbon-collapse-btn') || (e.target as HTMLElement).classList.contains('e-ribbon-last-item') ||
                    (e.target as HTMLElement).classList.contains('e-ribbon-first-item') || (e.target as HTMLElement).classList.contains('e-ribbon-group-of-btn') ||
                        (e.target as HTMLElement).classList.contains('e-ribbon-overall-of-btn') || (e.target as HTMLElement).classList.contains('e-ribbon-template')) {
            switch (e.action) {
            case 'rightarrow':
                this.handleNavigation(e, !this.enableRtl, ribbonControls);
                break;
            case 'leftarrow':
                this.handleNavigation(e, this.enableRtl, ribbonControls);
                break;
            case 'tab':
                if ((e.target as HTMLElement).classList.contains('e-combobox')) {
                    if (this.currentControlIndex < ribbonControls.length - 1) { this.currentControlIndex++; }
                }
                break;
            case 'shiftTab':
                if ((e.target as HTMLElement).classList.contains('e-combobox')) {
                    if (this.currentControlIndex > 0) { this.currentControlIndex--; }
                } else {
                    (this.tabObj.element.querySelector('.e-toolbar-item.e-active').querySelector('.e-tab-wrap') as HTMLElement).focus();
                    this.currentControlIndex = 0;
                }
            }
        }
    }

    private handleNavigation(e: Event, enableRtl: boolean, ribbonControls: Element[]): void {
        let groupContainer: HTMLElement;
        let prevGroupId: string;
        if (enableRtl) {
            if (this.currentControlIndex < ribbonControls.length - 1 && ribbonControls[this.currentControlIndex + 1].classList.contains('e-colorpicker')) {
                this.currentControlIndex++;
            }
        }
        else {
            if (this.currentControlIndex > 0 && ribbonControls[this.currentControlIndex - 1].classList.contains('e-colorpicker')) {
                this.currentControlIndex--;
            }
        }
        if ((!enableRtl && (this.currentControlIndex > 0)) || (enableRtl && (this.currentControlIndex < ribbonControls.length - 1))) {
            if (!(e.target as HTMLElement).classList.contains('e-combobox') && ((e.target as HTMLElement).classList.contains('e-control') || (e.target as HTMLElement).classList.contains('e-ribbon-template')) && !(e.target as HTMLElement).classList.contains('e-ribbon-last-item')) {
                if (enableRtl) { this.currentControlIndex++; }
                else {
                    const prevGroupContainer: HTMLElement = ribbonControls[parseInt(this.currentControlIndex.toString(), 10)].closest('.' + constants.RIBBON_GROUP_CONTAINER) as HTMLElement;
                    if (prevGroupContainer) { prevGroupId = prevGroupContainer.getAttribute('id'); }
                    this.currentControlIndex--;
                }
                let item: HTMLElement = ribbonControls[this.currentControlIndex].closest('.e-ribbon-item') as HTMLElement;
                while (item && item.classList.contains('e-disabled')) {
                    if (((enableRtl && this.currentControlIndex === ribbonControls.length - 1) ||
                        (!enableRtl && this.currentControlIndex === 0))) {
                        if ((ribbonControls[this.currentControlIndex].closest('.e-ribbon-item') as HTMLElement).classList.contains('e-disabled')) {
                            (this.tabObj.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).focus();
                            break;
                        }
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    enableRtl ? this.currentControlIndex++ : this.currentControlIndex--;
                    item = ribbonControls[this.currentControlIndex].closest('.e-ribbon-item') as HTMLElement;
                }
                (ribbonControls[parseInt(this.currentControlIndex.toString(), 10)] as HTMLElement).focus();
                if (this.activeLayout === 'Classic') {
                    groupContainer = ribbonControls[parseInt(this.currentControlIndex.toString(), 10)].closest('.' + constants.RIBBON_GROUP_CONTAINER) as HTMLElement;
                    if (enableRtl) {
                        let launcherIconEle: HTMLElement;
                        if (groupContainer) { launcherIconEle = groupContainer.querySelector('.e-ribbon-launcher-icon') as HTMLElement; }
                        if (launcherIconEle) {
                            const items: NodeListOf<Element> = groupContainer.querySelectorAll('.e-ribbon-item');
                            const elem = items[items.length - 1].querySelector('.e-control');
                            if (elem) { elem.classList.add('e-ribbon-last-item'); }
                        }
                    }
                    else {
                        if (groupContainer) {
                            const groupContainerId: string = groupContainer.getAttribute('id');
                            if (prevGroupId !== groupContainerId) {
                                const launcherIconEle: HTMLElement = groupContainer.querySelector('.e-ribbon-launcher-icon');
                                if (launcherIconEle) {
                                    ribbonControls[parseInt((this.currentControlIndex + 1).toString(), 10)].classList.add('e-ribbon-first-item');
                                }
                            }
                        }
                    }
                } else {
                    if (ribbonControls[parseInt((this.currentControlIndex).toString(), 10)].classList.contains('e-ribbon-first-item')) {
                        ribbonControls[parseInt((this.currentControlIndex).toString(), 10)].classList.remove('e-ribbon-first-item');
                    }
                    else if (ribbonControls[parseInt((this.currentControlIndex).toString(), 10)].classList.contains('e-ribbon-last-item')) {
                        ribbonControls[parseInt((this.currentControlIndex).toString(), 10)].classList.remove('e-ribbon-last-item');
                    }
                }
            }
        }
        else {
            if (this.activeLayout === 'Classic') {
                (this.tabObj.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).focus();
            }
            if (this.activeLayout === 'Simplified') {
                const overflowButton: HTMLElement = this.tabObj.element.querySelector('.e-ribbon-overall-of-btn') as HTMLElement;
                if (enableRtl && (overflowButton && !overflowButton.classList.contains('e-ribbon-hide'))) { overflowButton.focus(); }
                else { (this.tabObj.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).focus(); }
            }
        }
        if ((e.target as HTMLElement).classList.contains('e-ribbon-last-item')) {
            if (enableRtl) {
                groupContainer = ribbonControls[parseInt(this.currentControlIndex.toString(), 10)].closest('.' + constants.RIBBON_GROUP_CONTAINER) as HTMLElement;
                (groupContainer.querySelector('.e-ribbon-launcher-icon')as HTMLElement).focus();
            }
            else {
                this.currentControlIndex--;
                (ribbonControls[parseInt(this.currentControlIndex.toString(), 10)] as HTMLElement).focus();
            }
        }
        if (!enableRtl && (e.target as HTMLElement).classList.contains('e-ribbon-first-item')) {
            groupContainer = ribbonControls[parseInt((this.currentControlIndex - 1).toString(), 10)].closest('.' + constants.RIBBON_GROUP_CONTAINER) as HTMLElement;
            const launcherIconEle: HTMLElement = groupContainer.querySelector('.e-ribbon-launcher-icon') as HTMLElement;
            if (launcherIconEle) {
                (groupContainer.querySelector('.e-ribbon-launcher-icon') as HTMLElement).focus();
            }
        }
        if ((e.target as HTMLElement).classList.contains('e-ribbon-launcher-icon')) {
            if (enableRtl) {
                this.currentControlIndex++;
                (ribbonControls[parseInt(this.currentControlIndex.toString(), 10)] as HTMLElement).focus();
                if ((ribbonControls[parseInt((this.currentControlIndex - 1).toString(), 10)] as HTMLElement).classList.contains('e-ribbon-last-item')) {
                    (ribbonControls[parseInt((this.currentControlIndex - 1).toString(), 10)] as HTMLElement).classList.remove('e-ribbon-last-item');
                }
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                this.currentControlIndex;
                (ribbonControls[parseInt(this.currentControlIndex.toString(), 10)] as HTMLElement).focus();
            }
        }
        if ((e.target as HTMLElement).classList.contains('e-ribbon-collapse-btn')) {
            if (enableRtl) {
                this.currentControlIndex = 0;
                let ribbonItem: HTMLElement = ribbonControls[this.currentControlIndex].closest('.e-ribbon-item') as HTMLElement;
                while (ribbonItem && ribbonItem.classList.contains('e-disabled')) {
                    this.currentControlIndex++;
                    ribbonItem = ribbonControls[this.currentControlIndex].closest('.e-ribbon-item') as HTMLElement;
                }
                (ribbonControls[parseInt(this.currentControlIndex.toString(), 10)] as HTMLElement).focus();
            }
            else {
                const overflowButton: HTMLElement = this.tabObj.element.querySelector('.e-ribbon-overall-of-btn') as HTMLElement;
                if ((overflowButton && !overflowButton.classList.contains('e-ribbon-hide'))) { overflowButton.focus(); }
                else {
                    this.currentControlIndex = ribbonControls.length - 1;
                    let ribbonItem: HTMLElement = ribbonControls[this.currentControlIndex].closest('.e-ribbon-item') as HTMLElement;
                    while (ribbonItem && ribbonItem.classList.contains('e-disabled')) {
                        this.currentControlIndex--;
                        ribbonItem = ribbonControls[this.currentControlIndex].closest('.e-ribbon-item') as HTMLElement;
                    }
                    (ribbonControls[parseInt(this.currentControlIndex.toString(), 10)] as HTMLElement).focus();
                }
            }
        }
        if (this.activeLayout === 'Simplified' && (e.target as HTMLElement).classList.contains('e-ribbon-overall-of-btn')) {
            if (enableRtl) {
                (this.tabObj.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).focus();
            }
            else {
                this.currentControlIndex = ribbonControls.length - 1;
                (ribbonControls[parseInt(this.currentControlIndex.toString(), 10)] as HTMLElement).focus();
            }
        }
    }

    private resizeHandler(): void {
        const activeContent: HTMLElement = this.tabObj.element.querySelector('#' + this.tabs[this.selectedTab].id + constants.CONTENT_ID);
        this.checkOverflow(this.selectedTab, activeContent);
        if (this.scrollModule) {
            const scrollEle: HTMLElement = this.tabObj.element.querySelector('.' + constants.HORIZONTAL_SCROLLBAR);
            this.scrollModule.scrollStep = scrollEle.offsetWidth;
        }
        if (this.activeLayout === 'Simplified') {
            const activePopup: NodeListOf<Element> = document.querySelectorAll('.e-ribbon .e-dropdown-btn.e-active, .e-ribbon-group-overflow-ddb .e-dropdown-btn.e-active');
            if (activePopup.length) {
                for (let i: number = 0; i < activePopup.length; i++) {
                    const dropDownBtn: DropDownButton = getInstance(activePopup[parseInt(i.toString(), 10)] as HTMLElement, DropDownButton) as DropDownButton;
                    dropDownBtn.toggle();
                }
            }
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
        if (!this.hideLayoutSwitcher) { this.addExpandCollapse(); }
        this.renderInitialTab(this.selectedTab);
    }

    private ribbonTabSelected(e: SelectEventArgs): void {
        this.isAddRemove = false;
        const selectedTabId: string = e.selectedItem.getAttribute('data-id');
        let selectedIndex: number = getIndex<RibbonTabModel>(this.tabs, ((tab: RibbonTabModel) => (tab.id === selectedTabId)));
        selectedIndex = selectedIndex === -1 ? this.selectedTab : selectedIndex;
        const eventArgs: TabSelectedEventArgs = { previousIndex: this.selectedTab, selectedIndex: selectedIndex };
        this.setProperties({ selectedTab: selectedIndex }, true);
        this.calculateHiddenElementsWidth(selectedIndex);
        this.checkOverflow(selectedIndex, e.selectedContent.firstChild as HTMLElement);
        if (this.activeLayout === 'Simplified' && this.overflowDDB) {
            const overflowTarget: HTMLElement = this.overflowDDB.target as HTMLElement;
            const ofTabContainer: HTMLElement = overflowTarget.querySelector('.' + constants.RIBBON_TAB_ACTIVE);
            if (ofTabContainer) { ofTabContainer.classList.remove(constants.RIBBON_TAB_ACTIVE); }
            const activeTab: HTMLElement = overflowTarget.querySelector('#' + selectedTabId + constants.OVERFLOW_ID);
            if (activeTab) {
                activeTab.classList.add(constants.RIBBON_TAB_ACTIVE);
                this.overflowDDB.element.classList.remove(constants.HIDE_CSS);
                this.checkOverflowHiddenItems(false, selectedIndex);
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
        let isEmptyCollection: boolean;
        for (let i: number = 0; ((i < orderedGroups.length) && (tabContent.offsetWidth < activeContent.offsetWidth)); i++) {
            let isGroupUpdated: boolean = false;
            const group: RibbonGroupModel = orderedGroups[parseInt(i.toString(), 10)];
            const groupEle: HTMLElement = tabContent.querySelector('#' + group.id);
            const groupContainer: HTMLElement = groupEle.querySelector('#' + group.id + constants.CONTAINER_ID);
            for (let j: number = group.collections.length; ((j >= 1) && (tabContent.offsetWidth < activeContent.offsetWidth)); j--) {
                const collection: RibbonCollectionModel = group.collections[parseInt((j - 1).toString(), 10)];
                const collectionEle: HTMLElement = groupEle.querySelector('#' + collection.id);
                for (let k: number = collection.items.length; ((k >= 1) && (tabContent.offsetWidth < activeContent.offsetWidth)); k--) {
                    const item: RibbonItemModel = collection.items[k - 1];
                    const itemContainer: HTMLElement = collectionEle.querySelector('#' + item.id + constants.CONTAINER_ID);
                    if (((item.displayOptions === DisplayMode.Auto) ||
                        (item.displayOptions === (DisplayMode.Simplified | DisplayMode.Overflow))) && !isNullOrUndefined(itemContainer)) {
                        let groupHidden: boolean = false;
                        let itemHidden: boolean = false;
                        let isAllItemHidden: boolean = false;
                        let isEmptyCollection: boolean = false;
                        let groupItems: NodeListOf<Element>;
                        if (groupEle.classList.contains('e-hidden') || groupEle.classList.contains('e-hide-group')) {
                            groupItems = groupEle.querySelectorAll('.e-ribbon-item.e-hidden');
                            if (groupItems.length) {
                                for (let i: number = 0; i < groupItems.length; i++) {
                                    groupItems[parseInt(i.toString(), 10)].classList.remove('e-hidden');
                                }
                            }
                            if (groupEle.classList.contains('e-hide-group')) {
                                isAllItemHidden = true;
                                groupEle.classList.remove('e-hide-group');
                                groupEle.classList.remove('e-ribbon-emptyCollection');
                                if (this.hiddenGroups.indexOf(groupEle.id) !== -1) {
                                    this.hiddenGroups.splice(this.hiddenGroups.indexOf(groupEle.id), 1);
                                }
                            } else {
                                groupHidden = true;
                                groupEle.classList.remove('e-hidden');
                            }
                            if (!isGroupUpdated) {
                                this.calculateOverflowItemsWidth(groupEle.offsetWidth, false, tabIndex);
                                this.calculateMediumDataWidth(groupEle.offsetWidth, tabIndex, false);
                                isGroupUpdated = true;
                            }
                        }
                        else {
                            if (itemContainer.classList.contains('e-hidden')) {
                                itemHidden = true;
                                itemContainer.classList.remove('e-hidden');
                                if (groupEle.classList.contains('e-ribbon-emptyCollection')) {
                                    isEmptyCollection = true;
                                    groupEle.classList.remove('e-ribbon-emptyCollection');
                                }
                                this.calculateOverflowItemsWidth(itemContainer.offsetWidth, false, tabIndex);
                                this.calculateMediumDataWidth(itemContainer.offsetWidth, tabIndex, false);
                            }
                        }
                        itemContainer.setAttribute('data-simplified-width', (activeContent.offsetWidth).toString());
                        if (itemHidden) {
                            itemContainer.classList.add('e-hidden');
                        }
                        if (groupItems && groupItems.length) {
                            for (let i: number = 0; i < groupItems.length; i++) {
                                groupItems[parseInt(i.toString(), 10)].classList.add('e-hidden');
                            }
                        }
                        if (groupHidden) {
                            groupEle.classList.add('e-hidden');
                        }
                        if (isAllItemHidden) {
                            groupEle.classList.add('e-hide-group');
                            groupEle.classList.add('e-ribbon-emptyCollection');
                        }
                        if (isEmptyCollection) {
                            groupEle.classList.add('e-ribbon-emptyCollection');
                        }
                        this.createOverflowPopup(item, tabIndex, group.enableGroupOverflow, group.id
                            , group.header, itemContainer, groupContainer, true);
                        if (item.activeSize === RibbonItemSize.Small) {
                            const itemEle: HTMLElement = itemContainer.querySelector('#' + item.id);
                            (item as RibbonItem).setProperties({ activeSize: RibbonItemSize.Medium }, true);
                            this.setItemSize(itemEle, item);
                        }
                        if ((item.type === RibbonItemType.DropDown) || (item.type === RibbonItemType.SplitButton) || (item.type === RibbonItemType.GroupButton)) {
                            this.updatePopupItems(item, itemContainer, group.enableGroupOverflow, true);
                        }
                    }
                }
            }
            if (!(group.enableGroupOverflow || groupEle.querySelector('.' + constants.RIBBON_ITEM))) {
                groupEle.classList.add('e-ribbon-emptyCollection');
            }
            let itemsLength: NodeListOf<Element> = groupEle.querySelectorAll('.' + constants.RIBBON_ITEM)
            if (itemsLength && !group.enableGroupOverflow) {
                isEmptyCollection = this.checkEmptyCollection(itemsLength);
                if (isEmptyCollection) {
                    groupEle.classList.add('e-ribbon-emptyCollection');
                }
            }
            this.checkOverflowHiddenItems(group.enableGroupOverflow, tabIndex, group.id);
        }
    }

    private checkEmptyCollection(itemsLength: NodeListOf<Element>): boolean {
        let isEmptyCollection: boolean = true;
        for (let i: number = 0; i < itemsLength.length; i++) {
            if (!(itemsLength[parseInt(i.toString(), 10)].classList.contains('e-hidden'))) {
                isEmptyCollection = false;
                break;
            }
        }
        return isEmptyCollection;
    }

    private updatePopupItems(item: RibbonItemModel, itemEle: HTMLElement, isGroupOF: boolean, isMenu: boolean): void {
        const dropdown: DropDownButton | SplitButton = getComponent((itemEle.querySelector('#' + item.id) as HTMLElement), (item.type === RibbonItemType.DropDown || item.type === RibbonItemType.GroupButton) ? DropDownButton : SplitButton);
        const dropDownPopup: Popup = dropdown.dropDown;
        // popup is on right if (isGroupOF && isMenu)
        // The position is reversed if RTL is enabled.
        // isRight = ((isGroupOF && isMenu) && !this.enableRtl ) || (!(isGroupOF && isMenu) && this.enableRtl)  ==> (isGroupOF && isMenu) !== this.enableRtl
        const isLeft: boolean = (isGroupOF && isMenu) === this.enableRtl;
        if (dropDownPopup) {
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
    }

    private removeSimplfiedOverflow(tabContent: HTMLElement, activeContent: HTMLElement, tabIndex: number, isClear: boolean = false): void {
        const orderedGroups: RibbonGroupModel[] = this.getGroupResizeOrder(false, tabIndex);
        let flag: boolean = true;
        let isEmptyCollection: boolean;
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
                    if (((item.displayOptions === DisplayMode.Auto) ||
                        (item.displayOptions === (DisplayMode.Simplified | DisplayMode.Overflow))) && !isNullOrUndefined(itemContainer)) {
                        let width: number = parseInt(itemContainer.getAttribute('data-simplified-width'), 10);
                        const groupItemEle: HTMLElement = tabContent.querySelector('#' + group.id);
                        if (itemContainer.classList.contains('e-hidden') || groupItemEle.classList.contains('e-hidden')) {
                            width = Math.abs(width - activeContent.offsetWidth);
                        }
                        if (!isClear && (tabContent.offsetWidth < width)) { flag = false; break; }
                        const groupEle: HTMLElement = tabContent.querySelector('#' + collection.id);
                        if ((item.type === RibbonItemType.DropDown) || (item.type === RibbonItemType.SplitButton) || (item.type === RibbonItemType.GroupButton)) {
                            this.updatePopupItems(item, itemContainer, group.enableGroupOverflow, false);
                        }
                        groupEle.append(itemContainer);
                        if (itemContainer.classList.contains('e-hidden') || groupItemEle.classList.contains('e-hidden')) {
                            itemContainer.setAttribute('data-simplified-width', width.toString());
                            let isGroupHidden: boolean = false;
                            let widthDifference: number = 0;
                            if (itemContainer.classList.contains('e-hidden')) {
                                itemContainer.classList.remove('e-hidden');
                                if (groupItemEle.classList.contains('e-hide-group')) {
                                    isGroupHidden = true;
                                    widthDifference = this.checkWidthDifference(itemContainer, groupItemEle);
                                }
                                width = itemContainer.offsetWidth + widthDifference;
                                itemContainer.classList.add('e-hidden');
                            }
                            this.calculateOverflowItemsWidth(width, true, tabIndex);
                            this.calculateMediumDataWidth(width, tabIndex, true);
                            if (isGroupHidden) {
                                groupItemEle.classList.add('e-hide-group');
                                groupItemEle.classList.add('e-ribbon-emptyCollection');
                            }
                        }
                        this.removeOverflowEvent(item, itemContainer);
                        if (item.allowedSizes & RibbonItemSize.Small) {
                            (item as RibbonItem).setProperties({ activeSize: RibbonItemSize.Small }, true);
                            this.setItemSize(itemContainer.querySelector('#' + item.id), item);
                        }
                        const groupElement: HTMLElement = tabContent.querySelector('#' + group.id);
                        const itemEle: HTMLElement = groupElement.querySelector('.' + constants.RIBBON_ITEM);
                        if (groupElement.classList.contains('e-ribbon-emptyCollection') && itemEle !== null) {
                            let itemsLength: NodeListOf<Element> = groupElement.querySelectorAll('.' + constants.RIBBON_ITEM)
                            if (itemsLength) {
                                isEmptyCollection = this.checkEmptyCollection(itemsLength);
                                if (!isEmptyCollection) {
                                    groupElement.classList.remove('e-ribbon-emptyCollection');
                                }
                            }
                        }
                    }
                }
            }
            if (overflowDDB) {
                if (group.enableGroupOverflow) {
                    if (overflowtarget.childElementCount === 0 || (overflowtarget.childElementCount === 1 && this.isHeaderVisible(overflowtarget, group.id))) { this.removeOverflowButton(overflowDDB); }
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
        for (let i: number = 0; i < orderedGroups.length; i++) {
            this.checkOverflowHiddenItems(orderedGroups[parseInt(i.toString(), 10)].enableGroupOverflow, tabIndex, orderedGroups[parseInt(i.toString(), 10)].id);
        }
        if (this.overflowDDB) {
            const overflowEle: HTMLElement = this.overflowDDB.target as HTMLElement;
            if (overflowEle.childElementCount === 0) {
                this.removeOverflowButton(this.overflowDDB);
                this.overflowDDB = null;
            }
        }        
    }

    private checkOverflowHiddenItems(isGroupOF: boolean, tabIndex: number, groupId?: string): void {
        if (isGroupOF) {
            const overflowDDB: HTMLElement = document.querySelector('#' + groupId + constants.GROUPOF_BUTTON_ID);
            if (overflowDDB) {
                const overflowButton: DropDownButton = getInstance(overflowDDB, DropDownButton) as DropDownButton;
                const overflowBtnTarget: HTMLElement = overflowButton.target as HTMLElement;
                let itemEle: NodeListOf<Element> = overflowBtnTarget.querySelectorAll('.e-ribbon-item');
                let isHidden: boolean = true;
                for (let i: number = 0; i < itemEle.length; i++) {
                    if (!(itemEle[parseInt(i.toString(), 10)].classList.contains('e-hidden'))) {
                        isHidden = false;
                        break;
                    }
                }
                overflowButton.element.classList[isHidden ? 'add' : 'remove']('e-hidden');
            }
        }
        else {
            if (this.overflowDDB) {
                let isGroupHidden: boolean = true;
                let isItemHidden: boolean;
                const overflowEle: HTMLElement = this.overflowDDB.target as HTMLElement;
                const ofTabContainer: HTMLElement = overflowEle.querySelector('#' + this.tabs[parseInt(tabIndex.toString(), 10)].id + constants.OVERFLOW_ID);
                if (ofTabContainer) {
                    for (let k: number = 0; k < ofTabContainer.children.length; k++) {
                        isItemHidden = true;
                        const overflowTab: HTMLElement = ofTabContainer.children[parseInt(k.toString(), 10)] as HTMLElement;
                        let groupTabContainer: NodeListOf<Element> = overflowTab.querySelectorAll('.e-ribbon-item');
                        for (let n: number = 0; n < groupTabContainer.length; n++) {
                            if (!(groupTabContainer[parseInt(n.toString(), 10)].classList.contains('e-hidden'))) {
                                isItemHidden = false;
                                break;
                            }
                        }
                        overflowTab.classList[isItemHidden ? 'add' : 'remove']('e-hide-group');
                        if (!(overflowTab.classList.contains('e-hide-group')) && !(overflowTab.classList.contains('e-hidden'))) {
                            isGroupHidden = false;
                        }
                    }
                    this.overflowDDB.element.classList[isGroupHidden ? 'add' : 'remove'](constants.HIDE_CSS);
                }
            }
        }
    }

    private createOverflowPopup(item: RibbonItemModel, tabIndex: number, isGroupOF: boolean, groupId: string, groupHeader: string
        , itemEle: HTMLElement, groupContainer: HTMLElement, isResize?: boolean): void {
        let overflowButton: DropDownButton;
        const itemProp: itemProps = getGroup(this.tabs, groupId);
        const contentEle: HTMLElement = this.tabObj.items[parseInt(tabIndex.toString(), 10)].content as HTMLElement;
        const groupEle: HTMLElement = contentEle.querySelector('#' + groupId);
        if (isGroupOF) {
            const overflowDDB: HTMLElement = groupContainer.querySelector('#' + groupId + constants.GROUPOF_BUTTON_ID);
            if (!overflowDDB) {
                overflowButton = this.addOverflowButton(groupId + constants.GROUPOF_BUTTON_ID);
                overflowButton.element.classList.add(constants.RIBBON_GROUP_OF_BUTTON);
                groupContainer.appendChild(overflowButton.element);
            } else {
                overflowButton = getInstance(overflowDDB, DropDownButton) as DropDownButton;
            }
            const overflowBtnTarget: HTMLElement = overflowButton.target as HTMLElement;
            let headerEle: HTMLElement = overflowBtnTarget.querySelector('#' + groupId + constants.GROUPOF_BUTTON_ID + constants.HEADER_ID);
            if (!headerEle) {
                if (itemProp.group.overflowHeader) {
                    const groupHeader: HTMLElement = this.createElement('div', {
                        className: constants.RIBBON_OVERFLOW_HEADER,
                        id: groupId + constants.GROUPOF_BUTTON_ID + constants.HEADER_ID,
                        innerHTML: itemProp.group.overflowHeader
                    });
                    overflowBtnTarget.append(groupHeader);
                }
            }            
            if (groupEle) {
                if (groupEle.classList.contains('e-disabled')) {
                    overflowBtnTarget.classList.add('e-disabled');
                }
                if (groupEle.classList.contains('e-hidden')) {
                    overflowBtnTarget.classList.add('e-hidden');
                }
                if (groupEle.classList.contains('e-hide-group')) {
                    overflowBtnTarget.classList.add('e-hide-group');
                }
            }
            isResize ? overflowBtnTarget.insertBefore(itemEle, overflowBtnTarget.querySelector('.' + constants.RIBBON_ITEM)) 
                : overflowBtnTarget.append(itemEle);
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
                        ofGroupContainer = itemProp.group.overflowHeader ? this.createGroupContainer(groupId, itemProp.group.overflowHeader) : this.createGroupContainer(groupId, groupHeader);
                        if (groupEle) {
                            if (groupEle.classList.contains('e-disabled')) {
                                ofGroupContainer.classList.add('e-disabled');
                            }
                            if (groupEle.classList.contains('e-hidden')) {
                                ofGroupContainer.classList.add('e-hidden');
                            }
                            if (groupEle.classList.contains('e-hide-group')) {
                                ofGroupContainer.classList.add('e-hide-group');
                            }
                        }
                        ofTabContainer.append(ofGroupContainer);
                    }                        
                    isResize ? ofGroupContainer.insertBefore(itemEle, ofGroupContainer.querySelector('.' + constants.RIBBON_ITEM)) : ofGroupContainer.append(itemEle);                                           
                }
                else {
                    this.createOfTabContainer(groupId, groupHeader, itemEle, tabIndex);
                }
            }
            overflowButton = this.overflowDDB;
        }
        if (itemEle !== null) { this.addOverflowEvents(item, itemEle, overflowButton); }
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
        case 'GroupButton':
            if (this.activeLayout === 'Simplified') {
                this.ribbonGroupButtonModule.addOverFlowEvents(item, itemEle, overflowButton);
                break;
            }
        }
    }

    private createOfTabContainer(groupId: string, groupHeader: string, itemEle: HTMLElement, tabIndex: number): void {
        const ofTabContainer: HTMLElement = this.createElement('div', {
            id: this.tabs[parseInt(tabIndex.toString(), 10)].id + constants.OVERFLOW_ID,
            className: constants.RIBBON_OF_TAB_CONTAINER
        });
        const overflowtarget: HTMLElement = this.overflowDDB.target as HTMLElement;
        overflowtarget.append(ofTabContainer);
        const itemProp: itemProps = getGroup(this.tabs, groupId);
        let ofGroupContainer: HTMLElement = itemProp.group.overflowHeader ? this.createGroupContainer(groupId, itemProp.group.overflowHeader) : this.createGroupContainer(groupId, groupHeader);
        ofGroupContainer.append(itemEle);
        ofTabContainer.append(ofGroupContainer);
        if (tabIndex === this.selectedTab) { ofTabContainer.classList.add(constants.RIBBON_TAB_ACTIVE); }
        let groupEle: HTMLElement = document.querySelector('#' + groupId);
        if (groupEle) {
            if (groupEle.classList.contains('e-disabled')) {
                ofGroupContainer.classList.add('e-disabled');
            }
            if (groupEle.classList.contains('e-hidden')) {
                ofGroupContainer.classList.add('e-hidden');
            }
            if (groupEle.classList.contains('e-hide-group')) {
                ofGroupContainer.classList.add('e-hide-group');
            }
        }
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

    private checkValidCollectionLength (collections: RibbonCollectionModel[]): boolean {
        let count: number = 0;
        for (let i: number = 0; i < collections.length; i++) {
            const items: RibbonItemModel[] = collections[parseInt(i.toString(), 10)].items;
            for (let ind: number = 0; ind < items.length; ind++) {
                if (items[parseInt(ind.toString(), 10)].displayOptions & DisplayMode.Classic) { count ++; break; }
            }
            if (count > 1) { return false; }
        }
        return count === 1;
    }

    private checkClassicCollection (collections: RibbonCollectionModel[], n: number, isIncrement: boolean ): number {
        const items: RibbonItemModel[] = collections[parseInt(n.toString(), 10)].items;
        for (let ind: number = 0; ind < items.length; ind++) {
            if (items[parseInt(ind.toString(), 10)].displayOptions & DisplayMode.Classic) { return n; }
        }
        n = isIncrement ? n + 1 : n - 1;
        if (isIncrement) { return (n === collections.length) ? n : this.checkClassicCollection (collections, n, isIncrement); }
        else { return ( n < 0) ? n : this.checkClassicCollection (collections, n, isIncrement); }
    }

    private checkClassicItem (items: RibbonItemModel[], n: number, isIncrement: boolean ): number {
        const item: RibbonItemModel = items[parseInt(n.toString(), 10)];
        if (item.displayOptions & DisplayMode.Classic) { return n; }
        n = isIncrement ? n + 1 : n - 1;
        if (isIncrement) { return (n === items.length) ? n : this.checkClassicItem (items, n, isIncrement); }
        else { return ( n < 0) ? n : this.checkClassicItem (items, n, isIncrement); }
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
                if (!(item.displayOptions & DisplayMode.Classic)) { continue; }
                const ele: HTMLElement = activeContent.querySelector('#' + item.id + constants.CONTAINER_ID);
                shrinkEle.appendChild(ele);
                (item as RibbonItem).setProperties({ activeSize: RibbonItemSize.Medium }, true);
                if (item.type === RibbonItemType.GroupButton && this.activeLayout === 'Classic') {
                    this.setItemSize(ele.querySelector('#' + item.id + constants.RIBBON_GROUP_BUTTON_ID), item);
                }
                else {
                    this.setItemSize(ele.querySelector('#' + item.id), item);
                }                
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
                if (collection.items[0].type === RibbonItemType.GroupButton && this.activeLayout === 'Classic') {
                    this.setItemSize(ele.querySelector('#' + collection.items[0].id + constants.RIBBON_GROUP_BUTTON_ID), collection.items[0]);
                }
                else {
                    this.setItemSize(ele.querySelector('#' + collection.items[0].id), collection.items[0]);
                }                
            }
        };
        const orientation: string = group.orientation;
        if (orientation === ItemOrientation.Column) {
            for (let k: number = (group.collections.length - 1); k > 0; k--) {
                //to avoid negative index while checking for the second collection
                k = this.checkClassicCollection(group.collections, k, false);
                let l: number = k - 1;
                //Checks the element rendered at position n
                if ((l >= 0) && canReduceCollection(group.collections[parseInt(k.toString(), 10)])) {
                    l = this.checkClassicCollection(group.collections, l, false);
                    //Checks the element rendered at position n-1
                    if ((l >= 0) && canReduceCollection(group.collections[parseInt(l.toString(), 10)])) {
                        let m: number = l - 1;
                        if (m >= 0) { m = this.checkClassicCollection(group.collections, m, false); }
                        //Checks the element rendered at position n-2
                        if ((m >= 0) && canReduceCollection(group.collections[parseInt(m.toString(), 10)])) {
                            moveCollectionToColumn(m, k);
                        } else {
                            moveCollectionToColumn(l, k);
                        }
                        k = m;
                        if (!shouldSkip && (tabContent.offsetWidth > activeContent.offsetWidth)) { return true; }
                    } else {
                        k = l;
                    }
                }
            }
        } else {
            if (this.checkValidCollectionLength(group.collections)) {
                const collection: RibbonCollectionModel = group.collections[0];
                for (let k: number = (collection.items.length - 1); k > 0; k--) {
                    //to avoid negative index while checking for the second item
                    k = this.checkClassicItem(collection.items, k, false);
                    let l: number = k - 1;
                    //Checks the element rendered at position n
                    if ((l >= 0) && canReduceItem(collection.items[parseInt(k.toString(), 10)])) {
                        l = this.checkClassicItem(collection.items, l, false);
                        //Checks the element rendered at position n-1
                        if ((l >= 0) && canReduceItem(collection.items[parseInt(l.toString(), 10)])) {
                            let m: number = l - 1;
                            //Checks the element rendered at position n-2
                            if (m >= 0) { m = this.checkClassicItem(collection.items, m, false); }
                            if ((m >= 0) && canReduceItem(collection.items[parseInt(m.toString(), 10)])) {
                                moveItemToColumn(m, k);
                            } else {
                                moveItemToColumn(l, k);
                            }
                            k = m;
                            if (!shouldSkip && (tabContent.offsetWidth > activeContent.offsetWidth)) { return true; }
                        } else {
                            k = l;
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
        const reduceItemsToSmall: Function = (collectionIndex: number, start: number, end: number, middle: number = null): void => {
            const collection: RibbonCollectionModel = this.tabs[parseInt(tabIndex.toString(), 10)]
                .groups[parseInt(groupIndex.toString(), 10)].collections[parseInt(collectionIndex.toString(), 10)];
            const reduce: Function = (i: number): void => {
                const item: RibbonItemModel = collection.items[parseInt(i.toString(), 10)];
                if (item.displayOptions & DisplayMode.Classic) {
                    let ele: HTMLElement = activeContent.querySelector('#' + item.id);
                    (item as RibbonItem).setProperties({ activeSize: RibbonItemSize.Small }, true);
                    if (item.type === RibbonItemType.GroupButton) {
                        ele = activeContent.querySelector('#' + item.id + '_grpbtn');
                    }
                    this.setItemSize(ele, item);
                }
            };
            reduce(start);
            if (middle) { reduce(middle); }
            reduce(end);
        };
        const reduceCollectionsToSmall: Function = (index: number, start: number, end: number, middle: number = null): void => {
            const group: RibbonGroupModel = this.tabs[parseInt(tabIndex.toString(), 10)]
                .groups[parseInt(groupIndex.toString(), 10)];
            if (!shouldSkip) { shrinkColumns[parseInt(index.toString(), 10)].setAttribute('data-medium-width', activeContent.offsetWidth.toString()); }
            const reduce: Function = (i: number): void => {
                const collection: RibbonCollectionModel = group.collections[parseInt(i.toString(), 10)];
                if (collection.items[0].displayOptions & DisplayMode.Classic) {
                    let ele: HTMLElement = activeContent.querySelector('#' + collection.items[0].id);
                    (collection.items[0] as RibbonItem).setProperties({ activeSize: RibbonItemSize.Small }, true);
                    if (collection.items[0].type === RibbonItemType.GroupButton) {
                        ele = activeContent.querySelector('#' + collection.items[0].id + constants.RIBBON_GROUP_BUTTON_ID);
                    }
                    this.setItemSize(ele, collection.items[0]);
                }
            };
            reduce(start);
            if (middle) { reduce(middle); }
            reduce(end);
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
                    const l: number = this.checkClassicCollection(group.collections, start + 1, false); //next valid item
                    if (canReduceItem(group.collections[parseInt(start.toString(), 10)].items[0])
                        && canReduceItem(group.collections[parseInt(l.toString(), 10)].items[0])) {
                        if (end === l) { //if only 2 item, then next valid item will be the end item, else check for 3 rd item satus.
                            reduceCollectionsToSmall(k, start, end);
                        } else if (canReduceItem(group.collections[parseInt(end.toString(), 10)].items[0])) {
                            reduceCollectionsToSmall(k, start, end , l);
                        }
                        if (!shouldSkip && (tabContent.offsetWidth > activeContent.offsetWidth)) { return true; }
                    }
                }
            }
            for (let k: number = (group.collections.length - 1); k >= 0; k--) {
                const collection: RibbonCollectionModel = group.collections[parseInt(k.toString(), 10)];
                const classicItems: number[] = [];
                for (let i: number = 0; i < collection.items.length; i++) {
                    if (collection.items[parseInt(i.toString(), 10)].displayOptions & DisplayMode.Classic) {
                        classicItems.push(i);
                    }
                }
                //If items length is 1 then, it would have been already check for shrinked column
                if ((classicItems.length > 1)) {
                    if (canReduceItem(collection.items[classicItems[0]]) && canReduceItem(collection.items[classicItems[1]])) {
                        if (classicItems.length === 2) {
                            setWidth(collection.id);
                            reduceItemsToSmall(k, classicItems[0], classicItems[1]);
                        } else if (canReduceItem(collection.items[classicItems[2]])) {
                            setWidth(collection.id);
                            reduceItemsToSmall(k, classicItems[0], classicItems[2], classicItems[1]);
                        }
                        if (!shouldSkip && (tabContent.offsetWidth > activeContent.offsetWidth)) { return true; }
                    }
                }
            }
        } else {
            if (this.checkValidCollectionLength(group.collections)) {
                if (shrinkColumns.length > 0) {
                    for (let k: number = (shrinkColumns.length - 1); k >= 0; k--) {
                        const shrinkColumn: HTMLElement = shrinkColumns[parseInt(k.toString(), 10)];
                        const start: number = parseInt(shrinkColumn.getAttribute('data-start'), 10);
                        const end: number = parseInt(shrinkColumn.getAttribute('data-end'), 10);
                        //only 2 or 3 itmes alone can be present in shrinked column
                        const collection: RibbonCollectionModel = group.collections[0];
                        const l: number = this.checkClassicItem(collection.items, start + 1, false); //next valid item
                        if (canReduceItem(group.collections[0].items[parseInt(start.toString(), 10)])
                            && canReduceItem(group.collections[0].items[parseInt(l.toString(), 10)])) {
                            if (end === l) { //if only 2 item, then next valid item will be the end item, else check for 3 rd item satus.
                                setWidth(shrinkColumn.id);
                                reduceItemsToSmall(0, start, end);
                            } else if (canReduceItem(group.collections[0].items[parseInt(end.toString(), 10)])) {
                                setWidth(shrinkColumn.id);
                                reduceItemsToSmall(0, start, end, l);
                            }
                            if (!shouldSkip && (tabContent.offsetWidth > activeContent.offsetWidth)) { return true; }
                        }
                    }
                }
            } else {
                for (let k: number = (group.collections.length - 1); k >= 0; k--) {
                    const collection: RibbonCollectionModel = group.collections[parseInt(k.toString(), 10)];
                    for (let l: number = (collection.items.length - 1); l >= 0; l--) {
                        l = this.checkClassicItem(collection.items, l, false);
                        if ( l < 0) { continue; }
                        const item: RibbonItemModel = collection.items[parseInt(l.toString(), 10)];
                        if (canReduceItem(item)) {
                            item.type !== RibbonItemType.GroupButton ? setWidth(item.id) : setWidth(item.id + constants.RIBBON_GROUP_BUTTON_ID);
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
        const expandItemToMedium: Function = (collectionIndex: number, index: number, parentEle: HTMLElement): void => {
            const collection: RibbonCollectionModel = this.tabs[parseInt(tabIndex.toString(), 10)]
                .groups[parseInt(groupIndex.toString(), 10)].collections[parseInt(collectionIndex.toString(), 10)];
            const item: RibbonItemModel = collection.items[parseInt(index.toString(), 10)];
            if (item.displayOptions & DisplayMode.Classic) {
                let ele: HTMLElement = parentEle.id === item.id ? parentEle : parentEle.querySelector('#' + item.id);
                (item as RibbonItem).setProperties({ activeSize: RibbonItemSize.Medium }, true);
                if (item.type === RibbonItemType.GroupButton) {
                    ele = document.querySelector('#' + item.id + constants.RIBBON_GROUP_BUTTON_ID);
                }
                this.setItemSize(ele, item);
            }
        };
        const expandCollectionsToMedium: Function = (i: number): void => {
            const collections: RibbonCollectionModel[] = this.tabs[parseInt(tabIndex.toString(), 10)]
                .groups[parseInt(groupIndex.toString(), 10)].collections;
            const item: RibbonItemModel = collections[parseInt(i.toString(), 10)].items[0];
            if (item.displayOptions & DisplayMode.Classic) {
                let ele: HTMLElement = activeContent.querySelector('#' + collections[parseInt(i.toString(), 10)].items[0].id);
                (collections[parseInt(i.toString(), 10)].items[0] as RibbonItem).setProperties({ activeSize: RibbonItemSize.Medium }, true);
                if (item.type === RibbonItemType.GroupButton) {
                    ele = activeContent.querySelector('#' + collections[parseInt(i.toString(), 10)].items[0].id + constants.RIBBON_GROUP_BUTTON_ID);
                }
                this.setItemSize(ele, collections[parseInt(i.toString(), 10)].items[0]);
            }
        };
        if (orientation === ItemOrientation.Row) {
            // collection length is 1, then the it wll be covered in shrinked columns
            if (!this.checkValidCollectionLength(group.collections)) {
                for (let k: number = 0; k < group.collections.length; k++) {
                    const collection: RibbonCollectionModel = group.collections[parseInt(k.toString(), 10)];
                    for (let l: number = 0; l < collection.items.length; l++) {
                        l = this.checkClassicItem(collection.items, l, true);
                        if ( l === collection.items.length) { continue; }
                        const item: RibbonItemModel = collection.items[parseInt(l.toString(), 10)];
                        if (canExpandItem(item)) {
                            let itemEle: HTMLElement = activeContent.querySelector('#' + item.id);
                            if (item.type === 'GroupButton') {
                                itemEle = activeContent.querySelector('#' + item.id + constants.RIBBON_GROUP_BUTTON_ID);
                            }
                            const valString: string = itemEle.getAttribute('data-medium-width');
                            const value: number = valString ? parseInt(valString, 10) : null;
                            if (value && (shouldSkip || (tabContent.offsetWidth > value))) {
                                expandItemToMedium(k, l, itemEle);
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
                    const classicItems: number[] = [];
                    for (let i: number = 0; i < collection.items.length; i++) {
                        if (collection.items[parseInt(i.toString(), 10)].displayOptions & DisplayMode.Classic) {
                            classicItems.push(i);
                        }
                    }
                    if ((classicItems.length > 1) && value && (shouldSkip || (tabContent.offsetWidth > value))) {
                        expandItemToMedium(k, classicItems[0], itemEle);
                        expandItemToMedium(k, classicItems[1], itemEle);
                        if (classicItems.length === 3) { expandItemToMedium(k, classicItems[2], itemEle); }
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
                        const collection: RibbonCollectionModel = group.collections[0];
                        const l: number = this.checkClassicItem(collection.items, start + 1, true); //next valid item
                        expandItemToMedium(0, start, shrinkColumn);
                        expandItemToMedium(0, l, shrinkColumn);
                        // if l == end, then l is the last item, else L is the middle item. If l is middle then call the method for end.
                        if (l !== end) { expandItemToMedium(0, end, shrinkColumn); }
                    } else {
                        const m: number = this.checkClassicCollection(group.collections, start + 1, true); //next valid item
                        expandCollectionsToMedium(start);
                        expandCollectionsToMedium(m);
                        if (m !== end) { expandCollectionsToMedium(end); }
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
        const expandItemsToLarge: Function = (start: number, end: number, parentEle: HTMLElement, middle: null): void => {
            const items: RibbonItemModel[] = this.tabs[parseInt(tabIndex.toString(), 10)].
                groups[parseInt(groupIndex.toString(), 10)].collections[0].items;
            const reduce: Function = (i: number): void => {
                const item: RibbonItemModel = items[parseInt(i.toString(), 10)];
                if (item.displayOptions & DisplayMode.Classic) {
                    const container: HTMLElement = parentEle.querySelector('#' + item.id + constants.CONTAINER_ID);
                    let ele: HTMLElement = container.querySelector('#' + item.id);
                    (item as RibbonItem).setProperties({ activeSize: RibbonItemSize.Large }, true);
                    if (item.type === RibbonItemType.GroupButton) {
                        ele = container.querySelector('#' + item.id + constants.RIBBON_GROUP_BUTTON_ID);
                    }
                    this.setItemSize(ele, item);
                    parentEle.insertAdjacentElement('beforebegin', container);
                }
            };
            reduce(start);
            if (middle) { reduce(middle); }
            reduce(end);
            if (!shouldSkip || shouldClear) { remove(parentEle); }
        };
        const expandCollectionsToLarge: Function = (start: number, end: number, parentEle: HTMLElement, middle: null): void => {
            const collections: RibbonCollectionModel[] = this.tabs[parseInt(tabIndex.toString(), 10)].
                groups[parseInt(groupIndex.toString(), 10)].collections;
            const reduce: Function = (i: number): void => {
                const collection: RibbonCollectionModel = collections[parseInt(i.toString(), 10)];
                if (collection.items[0].displayOptions & DisplayMode.Classic) {
                    const collectionEle: HTMLElement = parentEle.querySelector('#' + collection.id);
                    let ele: HTMLElement = collectionEle.querySelector('#' + collection.items[0].id);
                    (collection.items[0] as RibbonItem).setProperties({ activeSize: RibbonItemSize.Large }, true);
                    if (collection.items[0].type === RibbonItemType.GroupButton) {
                        ele = collectionEle.querySelector('#' + collection.items[0].id + constants.RIBBON_GROUP_BUTTON_ID);
                    }
                    this.setItemSize(ele, collection.items[0]);
                    parentEle.insertAdjacentElement('beforebegin', collectionEle);
                }
            };
            reduce(start);
            if (middle) { reduce(middle); }
            reduce(end);
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
                    const collection: RibbonCollectionModel = group.collections[0];
                    const l: number = this.checkClassicItem(collection.items, start + 1, true); //next valid item
                    if (l === end) { expandItemsToLarge(start, end, shrinkColumn); }
                    else { expandItemsToLarge(start, end, shrinkColumn, l ); }
                } else {
                    const m: number = this.checkClassicCollection(group.collections, start + 1, true); //next valid item
                    if (m === end) {expandCollectionsToLarge(start, end, shrinkColumn); }
                    else { expandCollectionsToLarge(start, end, shrinkColumn, m ); }
                }
                if (!shouldSkip || shouldClear) { shrinkColumn.removeAttribute('data-large-width'); }
            } else if (value) { return true; }
        }
        return false;
    }

    private handleContentSize(itemEle: HTMLElement, isRemoveOverflow?: boolean): void {
        const itemContainer: HTMLElement = itemEle.closest('.' + constants.RIBBON_GROUP_CONTENT) as HTMLElement;
        (isRemoveOverflow ? (itemContainer.classList.add(constants.RIBBON_CONTENT_HEIGHT)) : (itemContainer.classList.remove(constants.RIBBON_CONTENT_HEIGHT)));
    }

    private setItemSize(itemEle: HTMLElement, item: RibbonItemModel): void {
        if (itemEle) {
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
            } else if (item.type === RibbonItemType.GroupButton) {
                this.ribbonGroupButtonModule.updateGroupButtonSize(itemEle, item);
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
                                                                                              groupContainer, groupOverFlow,
                                                                                              this.enableRtl);
            (this.tabs[parseInt(tabIndex.toString(), 10)].
                groups[parseInt(groupIndex.toString(), 10)] as RibbonGroup).setProperties({ isCollapsed: true }, true);
            for (let j: number = 0; j < group.collections.length; j++) {
                const collection: RibbonCollectionModel = group.collections[parseInt(j.toString(), 10)];
                const collectionEle: HTMLElement = groupContainer.querySelector('#' + collection.id);
                for (let k: number = 0; k < collection.items.length; k++) {
                    const item: RibbonItemModel = collection.items[parseInt(k.toString(), 10)];
                    const itemEle: HTMLElement = collectionEle.querySelector('#' + item.id + constants.CONTAINER_ID);
                    if (itemEle !== null) {
                        this.handleContentSize(itemEle);
                        this.addOverflowEvents(item, itemEle, dropdown);
                    }
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
                    if (itemEle !== null) {
                        this.handleContentSize(itemEle, true);
                        this.removeOverflowEvent(item, itemEle);
                    }
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
        this.currentControlIndex = 0;
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
            className: constants.RIBBON_OVERFLOW_TARGET,
            attrs: { 'tabindex': '0' }
        });
        const overflowDDB: DropDownButton = new DropDownButton({
            iconCss: constants.OVERFLOW_ICON,
            cssClass: constants.DROPDOWNBUTTON_HIDE + constants.SPACE + constants.RIBBON_GROUP_OVERFLOW_DDB,
            target: overflowTarget,
            locale: this.locale,
            enableRtl: this.enableRtl,
            enablePersistence: this.enablePersistence,
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
                const eventArgs: OverflowPopupEventArgs = { element: args.element, event: args.event, cancel: args.cancel };
                this.trigger('overflowPopupOpen', eventArgs, (ribbonArgs: OverflowPopupEventArgs) => {
                    if (ribbonArgs.cancel) {
                        args.cancel = true;
                    }
                });
            },
            beforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
                const ele: Element = args.event ? closest(args.event.target as HTMLElement, '.' + constants.RIBBON_POPUP_CONTROL) : null;
                const groupButtonEle = args.event ? closest(args.event.target as HTMLElement, '.e-ribbon-group-button-overflow-popup') : null;
                const eventArgs: OverflowPopupEventArgs = { element: args.element, event: args.event, cancel: args.cancel };
                this.trigger('overflowPopupClose', eventArgs, (ribbonArgs: OverflowPopupEventArgs) => {
                    if (ele || ribbonArgs.cancel || groupButtonEle) {
                        args.cancel = true;
                    }
                });
            }
        }, overflowButton);
        this.element.classList.add(constants.RIBBON_OVERFLOW);
        createTooltip(overflowTarget, this);
        let isGroupOf: boolean;
        overflowButton.onkeydown = overflowButton.onclick = () => { this.itemIndex = -1; isGroupOf = overflowButton.classList.contains('e-ribbon-overall-of-btn') ? false : true; };
        overflowTarget.onkeydown = (e: KeyboardEventArgs) => (this.upDownKeyHandler(e, overflowTarget, isGroupOf), this);
        return overflowDDB;
    }

    private upDownKeyHandler(e: KeyboardEventArgs, target: HTMLElement, isGroupOf: boolean): void {
        let items: HTMLCollectionOf<Element>;
        if (isGroupOf) { items = target.getElementsByClassName('e-ribbon-item'); }
        else {
            const currentList: HTMLElement = target.querySelector('.e-ribbon-of-tab.e-ribbon-active');
            items = currentList.getElementsByClassName('e-ribbon-item');
        }
        const control: HTMLElement = items[(!this.itemIndex || this.itemIndex < 0) ? 0 : this.itemIndex].querySelector('.e-control');
        const comboBoxEle = control && control.classList.contains('e-combobox') ? items[(!this.itemIndex || this.itemIndex < 0) ? 0 : this.itemIndex].querySelector('.e-combobox') : null;
        let ribbonItem: HTMLElement;
        let templateEle: HTMLElement;
        if (comboBoxEle === null || (e.key === 'Tab') || this.itemIndex < 0) {
            if (e.key === 'ArrowDown' || (!e.shiftKey && e.key === 'Tab')) {
                if ((!this.itemIndex && this.itemIndex !== 0) || this.itemIndex < 0 || this.itemIndex === items.length - 1) {
                    this.itemIndex = 0;
                    ribbonItem = items[this.itemIndex].closest('.e-ribbon-item') as HTMLElement;
                    this.findDisabledItem(ribbonItem, items, true);
                    if (comboBoxEle && e.key === 'Tab') { 
                        e.preventDefault(); 
                        const item = (items[this.itemIndex].querySelector('.e-control') as HTMLElement);
                        if (item) { item.focus(); }
                    }
                    templateEle = items[this.itemIndex].querySelector('.e-ribbon-template');
                }
                else if (this.itemIndex < items.length - 1 && this.itemIndex >= 0) {
                    this.itemIndex++;
                    ribbonItem = items[this.itemIndex].closest('.e-ribbon-item') as HTMLElement;
                    this.findDisabledItem(ribbonItem, items, true);
                    templateEle = items[this.itemIndex].querySelector('.e-ribbon-template');
                }
                if (templateEle) { templateEle.focus(); }
            }
            else if (e.key === 'ArrowUp' || (e.shiftKey && e.key === 'Tab')) {
                if (comboBoxEle === null || (e.key === 'Tab')) {
                    if (!this.itemIndex || this.itemIndex === -1) {
                        this.itemIndex = items.length - 1;
                        ribbonItem = items[this.itemIndex].closest('.e-ribbon-item') as HTMLElement;
                        this.findDisabledItem(ribbonItem, items, false);
                        if (comboBoxEle && (e.shiftKey && e.key === 'Tab')) { 
                            e.preventDefault(); 
                            const item = (items[this.itemIndex].querySelector('.e-control') as HTMLElement);
                            if (item) { item.focus(); }
                        }
                        templateEle = items[this.itemIndex].querySelector('.e-ribbon-template');
                    }
                    else if (this.itemIndex <= items.length - 1 && this.itemIndex > 0) {
                        this.itemIndex--;
                        ribbonItem = items[this.itemIndex].closest('.e-ribbon-item') as HTMLElement;
                        this.findDisabledItem(ribbonItem, items, false);
                        templateEle = items[this.itemIndex].querySelector('.e-ribbon-template');
                    }
                    if (templateEle) { templateEle.focus(); }
                }
            }
            target.setAttribute('index', this.itemIndex.toString());
        }
        const currentItemIndex: number = parseInt(target.getAttribute('index'), 10);
        let itemType: string = "";
        const controlItem: HTMLElement = items[parseInt(currentItemIndex.toString(), 10)] ? items[parseInt(currentItemIndex.toString(), 10)].querySelector('.e-control') : null;
        if (controlItem) { itemType = controlItem.getAttribute('data-control'); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ' || e.key === 'Tab') {
            if (itemType === 'ColorPicker') {
                if (e.key === 'Tab') { e.preventDefault(); }
                (items[parseInt(currentItemIndex.toString(), 10)].querySelector('.e-split-colorpicker') as HTMLElement).focus();
            }
            else {
                if (e.key === 'Tab') { e.preventDefault(); }
                const elem = (items[parseInt(currentItemIndex.toString(), 10)].querySelector('.e-control') as HTMLElement);
                if (elem) { elem.focus(); }
            }
            if (e.key === ' ' && (itemType === 'CheckBox')) {
                const checkBoxEle: HTMLElement = items[parseInt(currentItemIndex.toString(), 10)].querySelector('.e-control') as HTMLElement;
                const checkBox: CheckBox = getComponent(checkBoxEle, CheckBox) as CheckBox;
                this.itemIndex = -1;
                checkBox.click();
            }
        }
        if (((itemType === 'SplitButton') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft'))) {
            if (e.key === 'ArrowRight') {
                this.enableRtl ? (items[parseInt(currentItemIndex.toString(), 10)].querySelector('.e-control') as HTMLElement).focus() :
                    (items[parseInt(currentItemIndex.toString(), 10)].querySelector('.e-dropdown-btn') as HTMLElement).focus();
            }
            if (e.key === 'ArrowLeft') {
                this.enableRtl ? (items[parseInt(currentItemIndex.toString(), 10)].querySelector('.e-dropdown-btn') as HTMLElement).focus() :
                    (items[parseInt(currentItemIndex.toString(), 10)].querySelector('.e-control') as HTMLElement).focus();
            }
        }
        if (e.key === 'Enter') { this.itemIndex = -1; }
    }

    private findDisabledItem(ribbonItem: HTMLElement, items: HTMLCollectionOf<Element>, isIncrease: boolean): void {
        while (ribbonItem && ribbonItem.classList.contains('e-disabled')) {
            if (isIncrease) {
                if (this.itemIndex === items.length - 1 && (items[this.itemIndex].closest('.e-ribbon-item') as HTMLElement).classList.contains('e-disabled')) {
                    this.itemIndex = -1;
                }
            }
            else {
                if (this.itemIndex === 0 && (items[this.itemIndex].closest('.e-ribbon-item') as HTMLElement).classList.contains('e-disabled')) {
                    this.itemIndex = items.length;
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            isIncrease ? this.itemIndex++ : this.itemIndex--;
            ribbonItem = items[this.itemIndex].closest('.e-ribbon-item') as HTMLElement;
        }
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
        if (itemEle) {
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
            case 'GroupButton':
                this.ribbonGroupButtonModule.removeOverFlowEvents(item, itemEle);
                break;
            }
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

    private reRenderTabs(tabs: RibbonTabModel[]): void {
        this.destroyScroll();
        this.checkID(this.tabs, 'tab', this.element.id);
        for (const key in tabs) {
            const index: number = parseInt(key, 10)
            const tab: RibbonTabModel = tabs[parseInt(index.toString(), 10)];
            let isNewTab: boolean = false;
            for (var j: number = 0; j < (this.tabObj.items.length); j++) {
                if (this.tabs[parseInt(index.toString(), 10)].id === this.tabObj.items[parseInt(j.toString(), 10)].id) {
                    isNewTab = true;
                    break;
                }
            }
            if (!isNewTab) {
                this.destroyTabItems(this.tabsInternal);
                this.tabsInternal = this.tabs.slice();
                this.validateItemSize();
                const tabItems: TabItemModel[] = this.createTabItems(this.tabs);
                if (this.selectedTab >= this.tabs.length) { this.selectedTab = this.tabs.length - 1; }
                this.tabObj.setProperties({ items: tabItems, selectedItem: this.selectedTab });
                break;
            }
            else {
                const groups: RibbonGroupModel[] = this.tabs[parseInt(index.toString(), 10)].groups;
                const tabEle: HTMLElement = this.tabObj.element;
                const ribbonTab: RibbonTab = this.tabs[parseInt(index.toString(), 10)] as RibbonTab;
                ribbonTab.setProperties(tab, true);
                this.setProperties({ groups: this.checkID(ribbonTab.groups, 'group', ribbonTab.id) }, true);
                this.validateItemSize();
                const contentEle: HTMLElement = this.tabObj.items[parseInt(index.toString(), 10)].content as HTMLElement;
                if (groups) {
                    // Check whether header is passed by the user and sets the updated values.
                    if (tab.header) {
                        (this.tabObj.items[parseInt(index.toString(), 10)].header.text as HTMLElement).innerText = ribbonTab.header;
                    }
                    // Check whether cssClass is passed by the user, and if it is, then remove the old values.
                    if (tab.cssClass) {
                        if (this.tabObj.items[parseInt(index.toString(), 10)].cssClass) {
                            contentEle.classList.remove(this.tabObj.items[parseInt(index.toString(), 10)].cssClass);
                            tabEle.querySelector('.e-active').classList.remove(this.tabObj.items[parseInt(index.toString(), 10)].cssClass);
                        }
                        contentEle.classList.add(ribbonTab.cssClass);
                        tabEle.querySelector('.e-active').classList.add(ribbonTab.cssClass);
                    }
                    // Check whether group is passed by the user, and if it is, then remove the old values.
                    if (tab.groups) {
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
                        const groupElements: NodeListOf<HTMLElement> = contentEle.querySelectorAll('.e-ribbon-group');
                        // eslint-disable-next-line @typescript-eslint/tslint/config
                        groupElements.forEach(groupEle => { groupEle.remove(); });
                        const elements: HTMLElement[] = this.createGroups(ribbonTab.groups, index);
                        append(elements, contentEle);
                    }
                }
            }
        }
        const activeContent: HTMLElement = this.tabObj.element.querySelector('#' + this.tabs[this.selectedTab].id + constants.CONTENT_ID);
        this.checkOverflow(this.selectedTab, activeContent);
    }

    private switchLayout(): void {
        this.currentControlIndex = 0;
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
                        const alignType: string = groupList[parseInt(i.toString(), 10)].orientation;
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
                                while ((flag) && (item.displayOptions === DisplayMode.Classic)) {
                                    k++;
                                    const itemEle: HTMLElement = groupContainer.querySelector('#' + item.id + constants.CONTAINER_ID);
                                    const ele: HTMLElement = itemEle.querySelector('#' + item.id);
                                    this.destroyFunction(item, ele);
                                    itemEle.remove();
                                    if (k < itemList.length) { item = itemList[parseInt(k.toString(), 10)]; } else { flag = false; }
                                }
                                if (!flag) { break; }
                                let size: RibbonItemSize = ((item.allowedSizes === RibbonItemSize.Large) ||
                                    (item.allowedSizes & RibbonItemSize.Medium)) ? RibbonItemSize.Medium : RibbonItemSize.Small;
                                size = (!(item.displayOptions & DisplayMode.Simplified) && (item.displayOptions & DisplayMode.Overflow))
                                    ? RibbonItemSize.Medium : size;
                                let itemEle: HTMLElement;
                                if (!(item.displayOptions & DisplayMode.Classic)) {
                                    itemEle = this.createItems([item], alignType, group.id, group.header
                                        , group.enableGroupOverflow, tabIndex, groupContainer)[0];
                                    if (item.displayOptions & DisplayMode.Simplified) { groupCollection.append(itemEle); }
                                } else {
                                    itemEle = groupContainer.querySelector('#' + item.id + constants.CONTAINER_ID);
                                    if (item.displayOptions === (DisplayMode.Classic | DisplayMode.Overflow)) {
                                        this.createOverflowPopup(item, tabIndex, group.enableGroupOverflow, group.id, group.header,
                                                                 itemEle, groupContainer);
                                        if ((item.type === RibbonItemType.DropDown) || (item.type === RibbonItemType.SplitButton) || (item.type === RibbonItemType.GroupButton)) {
                                            this.updatePopupItems(item, itemEle, group.enableGroupOverflow, true);
                                        }
                                    }
                                    if (item.type === RibbonItemType.GroupButton) {
                                        this.ribbonGroupButtonModule.switchGroupButton(item, itemEle);
                                    }
                                    (item as RibbonItem).setProperties({ activeSize: size }, true);
                                    if (itemEle) {
                                        const ele: HTMLElement = itemEle.querySelector('#' + item.id);
                                        this.setItemSize(ele, item);
                                    }
                                }
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
                                const itemList: RibbonItemModel[] = collection.items;
                                let item: RibbonItemModel = collection.items[parseInt(k.toString(), 10)];
                                let flag: boolean = true;
                                while ((flag) && !(item.displayOptions & DisplayMode.Classic)) {
                                    k++;
                                    let itemEle: HTMLElement;
                                    if ((item.displayOptions & DisplayMode.Simplified) || (item.displayOptions & DisplayMode.Overflow)) {
                                        if (item.displayOptions & DisplayMode.Simplified) {
                                            itemEle = groupContainer.querySelector('#' + item.id + constants.CONTAINER_ID);
                                        }
                                        else { itemEle = overflowtarget.querySelector('#' + item.id + constants.CONTAINER_ID); }
                                        if (itemEle !== null) {
                                            const ele: HTMLElement = itemEle.querySelector('#' + item.id);
                                            this.destroyFunction(item, ele);
                                            itemEle.remove();
                                        }
                                    }
                                    if (k < itemList.length) { item = itemList[parseInt(k.toString(), 10)]; } else { flag = false; }
                                }
                                if (!flag) { break; }
                                if (!(item.displayOptions & (DisplayMode.Simplified | DisplayMode.Overflow))) {
                                    const itemEle: HTMLElement = this.createItems([item], alignType, group.id, group.header
                                        , group.enableGroupOverflow, tabIndex)[0];
                                    groupCollection.append(itemEle);
                                }
                                else {
                                    let itemEle: HTMLElement = groupContainer.querySelector('#' + item.id + constants.CONTAINER_ID);
                                    if (!itemEle && overflowtarget) {
                                        itemEle = overflowtarget.querySelector('#' + item.id + constants.CONTAINER_ID);
                                        if ((item.type === RibbonItemType.DropDown) || (item.type === RibbonItemType.SplitButton) || (item.type === RibbonItemType.GroupButton)) {
                                            this.updatePopupItems(item, itemEle, group.enableGroupOverflow, false);
                                        }
                                        this.removeOverflowEvent(item, itemEle);
                                    }
                                    if (item.type === RibbonItemType.GroupButton) {
                                        this.ribbonGroupButtonModule.switchGroupButton(item, itemEle);
                                    }
                                    if (itemEle) {
                                        groupCollection.append(itemEle);
                                    }
                                }
                                let ele: HTMLElement = groupContainer.querySelector('#' + item.id);
                                if (item.type === RibbonItemType.GroupButton) {
                                    ele = groupContainer.querySelector('#' + item.id + constants.RIBBON_GROUP_BUTTON_ID);
                                }
                                const itemsize: RibbonItemSize = (item.allowedSizes & RibbonItemSize.Large) ? RibbonItemSize.Large :
                                    (item.allowedSizes & RibbonItemSize.Medium) ? RibbonItemSize.Medium : RibbonItemSize.Small;
                                (item as RibbonItem).setProperties({ activeSize: itemsize }, true);
                                this.setItemSize(ele, item);
                            }
                            if (group.enableGroupOverflow && overflowDDB) {
                                if (overflowtarget.childElementCount === 0 || (overflowtarget.childElementCount === 1 && this.isHeaderVisible(overflowtarget, group.id))) {
                                    this.removeOverflowButton(overflowDDB);
                                }
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

    private createLauncherIcon(groupId: string, groupContainer: HTMLElement): void {
        const launcherIcon: HTMLElement = this.createElement('div', {
            className: constants.RIBBON_LAUNCHER_ICON_ELE + ' ' + (this.launcherIconCss ? this.launcherIconCss : constants.RIBBON_LAUNCHER_ICON),
            id: groupId + constants.LAUNCHER_ID,
            attrs: { 'tabindex': '0', 'type': 'button', 'aria-label': 'Launcher Icon', 'role': 'button' }
        });
        groupContainer.appendChild(launcherIcon);
        groupContainer.classList.add(constants.RIBBON_LAUNCHER);
        EventHandler.add(launcherIcon, 'click', this.launcherIconClicked.bind(this, groupId), this);
        EventHandler.add(launcherIcon, 'keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter') { this.launcherIconClicked(groupId); }
        }, this);
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
                this.createLauncherIcon(group.id, groupContainer);
            }
            const elements: HTMLElement[] = this.createCollection(group.collections, group.orientation
                , group.id, group.header, group.enableGroupOverflow, tabIndex, groupContainer);
            append(elements, groupContent);
            let isItemsHidden: boolean = true;
            for (let j: number = 0; j < elements.length; j++) {
                if (isItemsHidden) {                
                    for (let k: number = 0; k < elements[parseInt(j.toString(), 10)].children.length; k++) {
                        if (!(elements[parseInt(j.toString(), 10)].children[parseInt(k.toString(), 10)].classList.contains('e-hidden'))) {
                            isItemsHidden = false;
                            break;
                        }
                    }
                }
            }
            if (isItemsHidden) {
                groupEle.classList.add('e-hide-group');
            }
            if ((this.activeLayout === 'Simplified') && !(group.enableGroupOverflow || groupEle.querySelector('.' + constants.RIBBON_ITEM))) {
                groupEle.classList.add('e-ribbon-emptyCollection');
            }
            const initialProps = this.initialPropsData[parseInt(tabIndex.toString(), 10)] as {[key: string]: object};
            if (initialProps) {
                if (initialProps.hiddenGroups && (initialProps.hiddenGroups as string[]).length) {
                    this.updateGroupProps('hiddenGroups', initialProps, groupEle);
                }
                if (initialProps.disabledGroups && (initialProps.disabledGroups as string[]).length) {
                    this.updateGroupProps('disabledGroups', initialProps, groupEle);
                }
            }
        }
        if (this.initialPropsData[parseInt(tabIndex.toString(), 10)]) {
            delete this.initialPropsData[parseInt(tabIndex.toString(), 10)];
        }
        return groupElements;
    }

    private updateGroupProps(key: string, initialProps: {[key: string]: object}, groupEle: HTMLElement): void {
        // eslint-disable-next-line
        let groupIndex: number = (initialProps[key] as string[]).indexOf(groupEle.id);        
        if (groupIndex !== -1) {
            key === 'hiddenGroups' ? groupEle.classList.add('e-hidden') : groupEle.classList.add('e-disabled');   
        }
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

    private createRibbonItem (item : RibbonItemModel, itemEle : HTMLElement) : void {
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
        case 'GroupButton':
            this.ribbonGroupButtonModule.createGroupButton(item, itemEle);
            break;
        }
    }

    private createItems(itemList: RibbonItemModel[], alignType: string, groupId: string, groupHeader: string
        , isGroupOF: boolean, tabIndex: number, groupContainer?: HTMLElement): HTMLElement[] {
        const itemElements: HTMLElement[] = [];
        for (let i: number = 0; i < itemList.length; i++) {
            let item: RibbonItemModel = itemList[parseInt(i.toString(), 10)];
            //To stop rendering of items with simplified mode position type as none
            let flag: boolean = true;
            while ( flag &&
                (((this.activeLayout === 'Simplified') && !(item.displayOptions & (DisplayMode.Simplified | DisplayMode.Overflow))) ||
                ((this.activeLayout === 'Classic') && !(item.displayOptions & DisplayMode.Classic)))) {
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
            const initialProps = this.initialPropsData[parseInt(tabIndex.toString(), 10)] as {[key: string]: object};
            if (initialProps && initialProps.hiddenItems && (initialProps.hiddenItems as string[]).length) {
                const itemIndex: number = (initialProps.hiddenItems as string[]).indexOf(item.id);
                if (itemIndex !== -1) {
                    itemEle.classList.add('e-hidden');
                }
            }
            this.createRibbonItem(item, itemEle);
            if ((this.activeLayout === 'Simplified') && ((item.displayOptions === DisplayMode.Overflow) || (item.displayOptions === (DisplayMode.Classic | DisplayMode.Overflow)))) {
                this.createOverflowPopup(item, tabIndex, isGroupOF, groupId, groupHeader, itemEle, groupContainer);
                if ((item.type === RibbonItemType.DropDown) || (item.type === RibbonItemType.SplitButton) || (item.type === RibbonItemType.GroupButton)) {
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
            id: item.id,
            attrs: { 'tabindex': '-1' }
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
        if (this.ribbonBackstageModule) {
            this.ribbonBackstageModule.setCommonProperties(commonProp);
        }
        for (let i: number = 0; i < this.tabs.length; i++) {
            const tab: RibbonTabModel = this.tabs[parseInt(i.toString(), 10)];
            const contentEle: HTMLElement = this.tabObj.items[parseInt(i.toString(), 10)].content as HTMLElement;
            if (contentEle.querySelector('.' + constants.RIBBON_GROUP)) {
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
                                if (item.displayOptions & DisplayMode.Classic) {
                                    ele = dropdownElement ? this.ribbonDropDownModule.getDDBItemElement(dropdownElement, item.id) : item.type === RibbonItemType.GroupButton ? contentEle.querySelector('#' + item.id + constants.RIBBON_GROUP_BUTTON_ID) : contentEle.querySelector('#' + item.id);
                                }
                            } else {
                                //Checks for Simplified and Auto options (Auto = classic + simplified + popup)
                                ele = (item.displayOptions & DisplayMode.Simplified) ? contentEle.querySelector('#' + item.id) : null;
                                // element will be null for "Popup" and if the item is moved to overflow in "Auto" mode
                                if (!ele) {
                                    ele = (dropdown.target as HTMLElement).querySelector('#' + item.id);
                                    if (item.type === 'DropDown') {
                                        this.updatePopupItems(item, dropdown.target as HTMLElement, group.enableGroupOverflow, true);
                                    }
                                }
                            }
                            if (ele) {
                                const moduleName: string = this.getItemModuleName(item);
                                if (moduleName !== 'template') {
                                    if (moduleName === 'group-btn' && this.activeLayout === 'Classic') {
                                        for (let i: number = 0; i < item.groupButtonSettings.items.length; i++) {
                                            const btnEle: HTMLElement = ele.querySelector('#' + item.id + constants.RIBBON_GROUP_BUTTON_ID + i);
                                            updateCommonProperty(btnEle, 'btn', commonProp);
                                        }
                                    }
                                    else if (moduleName === 'group-btn' && this.activeLayout === 'Simplified') {
                                        updateCommonProperty(ele, 'dropdown-btn', commonProp);
                                        for (let i: number = 0; i < item.groupButtonSettings.items.length; i++) {
                                            const btnEle: HTMLElement = document.querySelector('#' + item.id + constants.RIBBON_GROUP_BUTTON_ID + i);
                                            updateCommonProperty(btnEle, 'btn', commonProp);
                                        }
                                    }
                                    else {
                                        updateCommonProperty(ele, moduleName, commonProp);
                                    }
                                } else if (!isNullOrUndefined(commonProp.enableRtl)) {
                                    ele.classList.toggle(constants.RTL_CSS, commonProp.enableRtl);
                                }
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
                            if (item.displayOptions & DisplayMode.Classic) {
                                ele = dropdownElement ? this.ribbonDropDownModule.getDDBItemElement(dropdownElement, item.id) :
                                    contentEle.querySelector('#' + item.id);
                                if (item.type === RibbonItemType.GroupButton) {
                                    ele = dropdownElement ? this.ribbonDropDownModule.getDDBItemElement(dropdownElement, item.id + constants.RIBBON_GROUP_BUTTON_ID) :
                                        contentEle.querySelector('#' + item.id + constants.RIBBON_GROUP_BUTTON_ID);
                                }
                            }
                        } else {
                            //Checks for Simplified and Auto options (Auto = classic + simplified + popup)
                            ele = (item.displayOptions & DisplayMode.Simplified) ?
                                contentEle.querySelector('#' + item.id) : null;
                            // element will be null for "Popup" and if the item is moved to overflow in "Auto" mode
                            if (!ele) {
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
        }
        else if (moduleName === 'group-btn') {
            if (this.activeLayout === 'Classic') {
                for (let i: number = 0; i < item.groupButtonSettings.items.length; i++) {
                    const btnEle: HTMLElement = ele.querySelector('#' + item.id + constants.RIBBON_GROUP_BUTTON_ID + i);
                    if (btnEle) {
                        destroyControl(btnEle, 'btn');
                    }
                }
            }
            else {
                this.ribbonGroupButtonModule.destroyDropDown(item);
            }
            for (let i: number = 0; i < item.groupButtonSettings.items.length; i++) {
                if (item.groupButtonSettings.items[parseInt(i.toString(), 10)].ribbonTooltipSettings) {
                    const groupButtonID: string = item.id + constants.RIBBON_GROUP_BUTTON_ID + i;
                    const index: number = getIndex(this.tooltipData, (e: ribbonTooltipData) => { return e.id === groupButtonID; });
                    if (index !== -1) {
                        this.tooltipData.splice(index, 1);
                    }
                }
            }
        }
        else if (moduleName !== 'template') {
            destroyControl(ele, moduleName);
        }
        if (item.ribbonTooltipSettings) {
            const index: number = getIndex(this.tooltipData, (e: RibbonItemModel) => { return e.id === item.id + constants.CONTAINER_ID; });
            if (index !== -1) {
                this.tooltipData.splice(index, 1);
            }
        }
        if (item.type === 'GroupButton') {
            this.ribbonGroupButtonModule.destroyDropDown(item);
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
        case 'GroupButton':
            return 'group-btn';
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
     * Shows a specific tab in the ribbon.
     *
     * @param {string} tabId - The ID of the tab to be shown.
     * @returns {void}
     */
    public showTab(tabId: string): void {
        this.showHideTab(tabId, false);
    }

    /**
     * Hides a specific tab in the ribbon.
     *
     * @param {string} tabId - The ID of the tab to be hidden.
     * @returns {void}
     */
    public hideTab(tabId: string): void {
        this.showHideTab(tabId, true);
    }

    private showHideTab(tabId: string, value: boolean): void {
        const index: number = getIndex(this.tabs, (e: RibbonTab) => { return e.id === tabId; });
        if (index === -1) { return; }
        this.tabObj.hideTab(index, value);
    }

    /**
     * Enables a specific tab in the ribbon.
     *
     * @param {string} tabId - The ID of the tab to be enabled.
     * @returns {void}
     */
    public enableTab(tabId: string): void {
        this.enableDisableTab(tabId, true);
    }

    /**
     * Disables a specific tab in the ribbon.
     *
     * @param {string} tabId - The ID of the tab to be disabled.
     * @returns {void}
     */
    public disableTab(tabId: string): void {
        this.enableDisableTab(tabId, false);
    }

    private enableDisableTab(tabId: string, value: boolean): void {
        const index: number = getIndex(this.tabs, (e: RibbonTab) => { return e.id === tabId; });
        if (index === -1) { return; }
        this.tabObj.enableTab(index, value);
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
                        let ele: HTMLElement = dropdownElement ? this.ribbonDropDownModule.getDDBItemElement(dropdownElement, item.id) : contentEle.querySelector('#' + item.id);
                        if (item.type === RibbonItemType.GroupButton && this.activeLayout === 'Classic') {
                            ele = dropdownElement ? this.ribbonDropDownModule.getDDBItemElement(dropdownElement, item.id + constants.RIBBON_GROUP_BUTTON_ID) :
                                contentEle.querySelector('#' + item.id + constants.RIBBON_GROUP_BUTTON_ID);
                        }
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
                    if ((dropdown.target as HTMLElement).childElementCount === 0 || ((dropdown.target as HTMLElement).childElementCount === 1 && this.isHeaderVisible(dropdown.target as HTMLElement, itemProp.group.id))) {
                        this.removeOverflowButton(dropdown);
                    }
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

    private isHeaderVisible(headerEle: HTMLElement, groupID: string): boolean {
        return headerEle.querySelector('#' + groupID + constants.GROUPOF_BUTTON_ID + constants.HEADER_ID) ? true : false;
    }

    /**
     * Hides a specific group within a ribbon tab.
     *
     * @param {string} groupID - The ID of the group to be hidden.
     * @returns {void}
     */
    public hideGroup(groupID: string): void {
        this.showHideGroup(groupID, true);
    }

    /**
     * Shows a specific group within a ribbon tab.
     *
     * @param {string} groupID - The ID of the group to be shown.
     * @returns {void}
     */
    public showGroup(groupID: string): void {
        this.showHideGroup(groupID, false);
    }

    private showHideGroup(groupID: string, isHidden: boolean): void {
        let overflowDDB: DropDownButton;
        let overflowtarget: HTMLElement;
        const itemProp: itemProps = getGroup(this.tabs, groupID);
        if (!itemProp) { return; }
        const contentEle: HTMLElement = this.tabObj.items[itemProp.tabIndex].content as HTMLElement;
        const groupEle: HTMLElement = contentEle.querySelector('#' + groupID);
        if (groupEle) {
            this.updateHiddenElements(itemProp.tabIndex, isHidden ? 'hideGroup' : 'showGroup', groupID, isHidden, groupEle);
        }
        else {
            this.updateInitialProps(itemProp.tabIndex, groupID, 'hiddenGroups', isHidden);
        }
        if (this.overflowDDB) {
            const overflowEle: HTMLElement = this.overflowDDB.target as HTMLElement;
            const ofTabContainer: HTMLElement = overflowEle.querySelector('#' + this.tabs[parseInt(itemProp.tabIndex.toString(), 10)].id + constants.OVERFLOW_ID);
            if (itemProp.group.enableGroupOverflow) {
                const overflowDDBEle: HTMLElement = contentEle.querySelector('#' + groupID + constants.GROUPOF_BUTTON_ID);
                if (overflowDDBEle) {
                    overflowDDB = getInstance(overflowDDBEle, DropDownButton) as DropDownButton;
                    overflowtarget = overflowDDB.target as HTMLElement;
                }
                if (overflowtarget) {
                    isHidden ? overflowtarget.classList.add('e-hidden') : overflowtarget.classList.remove('e-hidden');
                }
            }
            else if (ofTabContainer) {
                const grpContainer: HTMLElement = ofTabContainer.querySelector('#' + groupID + constants.CONTAINER_ID);
                if (grpContainer) {
                    isHidden ? grpContainer.classList.add('e-hidden') : grpContainer.classList.remove('e-hidden');
                }
            }
        }
        if (this.selectedTab === itemProp.tabIndex) {
            this.refreshLayout();
        }
    }

    private updateHiddenElements(tabIndex: number, key: string, id: string, isHidden: boolean, element: HTMLElement, group?: RibbonGroupModel): void {
        if (isHidden) {
            if (!(element.classList.contains('e-hidden'))) {
                this.checkHiddenElements(key, id, tabIndex);
                element.classList.add('e-hidden');
                if (key === 'hideItem') {
                    this.checkHiddenItems(group, isHidden, tabIndex);
                }
                this.calculateHiddenElementsWidth(tabIndex);
            }
        } else {
            if (element.classList.contains('e-hidden')) {
                this.checkHiddenElements(key, id, tabIndex);
                element.classList.remove('e-hidden');
                this.calculateHiddenElementsWidth(tabIndex);
                if (key === 'showItem') {
                    this.checkHiddenItems(group, isHidden, tabIndex);
                }
            }
        }
    }

    private checkHiddenElements(key: string, id: string, tabIndex: number): void {
        if (this.activeLayout === 'Simplified') {
            let hiddenProps = this.hiddenElements[parseInt(tabIndex.toString(), 10)] as {[key: string]: object};
            if (!hiddenProps) {
                this.hiddenElements[parseInt(tabIndex.toString(), 10)] = {};
                hiddenProps = this.hiddenElements[parseInt(tabIndex.toString(), 10)] as {[key: string]: object};
            }
            if (hiddenProps) {
                /* eslint-disable */
                if (!hiddenProps[key]) {
                    hiddenProps[key] = [];
                }
                if ((hiddenProps[key] as string[]).length) {
                    let index: number = (hiddenProps[key] as string[]).indexOf(id);
                    if (index === -1) {
                        (hiddenProps[key] as string[]).push(id);
                    }
                }
                else {
                    (hiddenProps[key] as string[]).push(id);
                }
                /* eslint-enable */
            }
        }
    }

    private updateItemsSimplifiedWidth(tabIndex: number, key: string): void {
        let hiddenProps = this.hiddenElements[parseInt(tabIndex.toString(), 10)] as {[key: string]: object};
        /* eslint-disable */
        if (hiddenProps && hiddenProps[key] && (hiddenProps[key] as string[]).length) {
            for (let i: number = 0; i < (hiddenProps[key] as string[]).length; i++) {
                const contentEle: HTMLElement = this.tabObj.items[tabIndex].content as HTMLElement;
                let hiddenEle: HTMLElement;
                let groupEle: HTMLElement;
                let isGroupHidden: boolean = false;
                let widthDifference: number = 0;
                if (key === 'hideGroup' || key === 'showGroup') {
                    hiddenEle = contentEle.querySelector('#' + (hiddenProps[key] as string[])[i]);
                } else {
                    hiddenEle = contentEle.querySelector('#' + (hiddenProps[key] as string[])[i] + constants.CONTAINER_ID);
                }
                if (hiddenEle) {
                    if (key === 'hideGroup' || key === 'hideItem') {
                        let isHidden: boolean = false;
                        if (hiddenEle.classList.contains('e-hidden')) {
                            isHidden = true;
                            hiddenEle.classList.remove('e-hidden');
                        }
                        if (key === 'hideItem') {
                            groupEle = hiddenEle.closest('.e-ribbon-group') as HTMLElement;
                            if (groupEle.classList.contains('e-hide-group')) {
                                isGroupHidden = true;
                                widthDifference = this.checkWidthDifference(hiddenEle, groupEle);
                            }
                        }
                        this.calculateOverflowItemsWidth(hiddenEle.offsetWidth + widthDifference, true, tabIndex);
                        this.calculateMediumDataWidth(hiddenEle.offsetWidth + widthDifference, tabIndex, true);
                        if (isHidden) {
                            hiddenEle.classList.add('e-hidden');
                        }
                    } else {
                        if (key === 'showItem') {
                            groupEle = hiddenEle.closest('.e-ribbon-group') as HTMLElement;
                            if (groupEle.classList.contains('e-hide-group')) {
                                isGroupHidden = true;
                                groupEle.classList.remove('e-hide-group');
                                groupEle.classList.remove('e-ribbon-emptyCollection');
                                widthDifference = Math.abs(hiddenEle.offsetWidth - groupEle.offsetWidth);
                                if (this.hiddenGroups.indexOf(groupEle.id) !== -1) {
                                    this.hiddenGroups.splice(this.hiddenGroups.indexOf(groupEle.id), 1);
                                }
                            }
                            else {
                                if (this.hiddenGroups.indexOf(groupEle.id) !== -1) {
                                    let hiddenItems: NodeListOf<Element> = groupEle.querySelectorAll('.e-ribbon-item:not(.e-hidden)');
                                    hiddenItems.forEach((item: HTMLElement) => {
                                        if (item.id !== hiddenEle.id) {
                                            item.classList.add('e-hidden');
                                        }
                                    });
                                    widthDifference = Math.abs(hiddenEle.offsetWidth - groupEle.offsetWidth);
                                    hiddenItems.forEach((item: HTMLElement) => {
                                        if (item.id !== hiddenEle.id) {
                                            item.classList.remove('e-hidden');
                                        }
                                    });
                                    this.hiddenGroups.splice(this.hiddenGroups.indexOf(groupEle.id), 1);
                                }
                            }
                        }
                        this.calculateOverflowItemsWidth(hiddenEle.offsetWidth + widthDifference, false, tabIndex);
                        this.calculateMediumDataWidth(hiddenEle.offsetWidth + widthDifference, tabIndex, false);
                    }
                    if (isGroupHidden) {
                        groupEle.classList.add('e-hide-group');
                        groupEle.classList.add('e-ribbon-emptyCollection');
                    }
                }
                let index: number = (hiddenProps[key] as string[]).indexOf((hiddenProps[key] as string[])[i]);
                if (index !== -1) {
                    (hiddenProps[key] as string[]).splice(index, 1);
                    i--;
                }
                /* eslint-enable */
            }
        }
    }

    private checkWidthDifference(hiddenEle: HTMLElement, groupEle: HTMLElement): number {
        let widthDifference: number = 0;
        groupEle.classList.remove('e-hide-group');
        groupEle.classList.remove('e-ribbon-emptyCollection');
        if (this.hiddenGroups.length) {
            if (this.hiddenGroups.indexOf(groupEle.id) === -1) {
                this.hiddenGroups.push(groupEle.id);
                widthDifference = Math.abs(hiddenEle.offsetWidth - groupEle.offsetWidth);
            }
        } else {
            this.hiddenGroups.push(groupEle.id);
            widthDifference = Math.abs(hiddenEle.offsetWidth - groupEle.offsetWidth);
        }
        return widthDifference;
    }

    private calculateHiddenElementsWidth(tabIndex: number): void {
        if (tabIndex === this.selectedTab && this.activeLayout === 'Simplified') {
            let hiddenProps = this.hiddenElements[parseInt(tabIndex.toString(), 10)] as {[key: string]: object};
            if (hiddenProps) {
                for (let i: number = 0; i < Object.keys(hiddenProps).length; i++) {
                    this.updateItemsSimplifiedWidth(tabIndex, Object.keys(hiddenProps)[parseInt(i.toString(), 10)]);
                }
            }
        }
    }

    private calculateMediumDataWidth(hiddenWidth: number, tabIndex: number, isHidden: boolean): void {
        if (this.selectedTab === tabIndex && this.activeLayout === 'Simplified') {
            const activeContent: HTMLElement = this.tabObj.element.querySelector('#' + this.tabs[parseInt(tabIndex.toString(), 10)].id + constants.CONTENT_ID);
            let mediumDataItems: Array<Element> = Array.prototype.slice.call(activeContent.querySelectorAll('.e-ribbon-item'));
            if (this.overflowDDB) {
                const overflowEle: HTMLElement = this.overflowDDB.target as HTMLElement;
                let overflowItems: NodeListOf<Element> = overflowEle.querySelectorAll('.e-ribbon-item');
                let selectedOFTab: HTMLElement = document.querySelector('#' + this.tabs[parseInt(tabIndex.toString(), 10)].id + constants.OVERFLOW_ID) as HTMLElement;
                for (let i: number = 0; i < overflowItems.length; i++) {
                    let ofTab: HTMLElement = overflowItems[parseInt(i.toString(), 10)].closest('#' + this.tabs[parseInt(tabIndex.toString(), 10)].id + constants.OVERFLOW_ID) as HTMLElement;
                    if (selectedOFTab && ofTab && selectedOFTab.id === ofTab.id && overflowItems[parseInt(i.toString(), 10)].hasAttribute('data-medium-width')) {
                        mediumDataItems.push(overflowItems[parseInt(i.toString(), 10)]);
                    }
                }
            }
            let groupOFButton: NodeListOf<Element> = activeContent.querySelectorAll('.e-ribbon-group-of-btn');
            for (let i: number = 0; i < groupOFButton.length; i++) {
                let overflowButton: DropDownButton = getInstance(groupOFButton[parseInt(i.toString(), 10)] as HTMLElement, DropDownButton) as DropDownButton;
                const overflowBtnTarget: HTMLElement = overflowButton.target as HTMLElement;
                let overflowItems: NodeListOf<Element> = overflowBtnTarget.querySelectorAll('.e-ribbon-item');
                for (let i: number = 0; i < overflowItems.length; i++) {
                    if (overflowItems[parseInt(i.toString(), 10)].hasAttribute('data-medium-width')) {
                        mediumDataItems.push(overflowItems[parseInt(i.toString(), 10)]);
                    }
                }
            }
            for (let i: number = 0; i < mediumDataItems.length; i++) {
                if (mediumDataItems[parseInt(i.toString(), 10)].hasAttribute('data-medium-width')) {
                    let previousWidth = parseInt(mediumDataItems[parseInt(i.toString(), 10)].getAttribute('data-medium-width'),10);
                    mediumDataItems[parseInt(i.toString(), 10)].setAttribute('data-medium-width', isHidden ? (previousWidth - hiddenWidth).toString() : (previousWidth + hiddenWidth).toString());
                }
            }
        }
    }

    private calculateOverflowItemsWidth(hiddenItem: number, isHidden: boolean, tabIndex: number): void {
        if (this.selectedTab === tabIndex && this.activeLayout === 'Simplified') {
            const groupList: RibbonGroupModel[] = this.tabs[parseInt(tabIndex.toString(), 10)].groups;
            for (let i: number = 0; i < groupList.length; i++) {
                const group: RibbonGroupModel = groupList[parseInt(i.toString(), 10)];
                if (group.enableGroupOverflow) {
                    let groupContainer: HTMLElement = document.querySelector('#' + group.id) as HTMLElement;
                    let overflowButton: DropDownButton;
                    const overflowDDB: HTMLElement = groupContainer.querySelector('#' + group.id + constants.GROUPOF_BUTTON_ID);
                    if (overflowDDB) {
                        overflowButton = getInstance(overflowDDB, DropDownButton) as DropDownButton;
                    }
                    if (overflowButton) {
                        const overflowEle: HTMLElement = overflowButton.target as HTMLElement;
                        let overflowItems: NodeListOf<Element> = overflowEle.querySelectorAll('.e-ribbon-item');
                        for (let i: number = 0; i < overflowItems.length; i++) {
                            let previousWidth = parseInt(overflowItems[parseInt(i.toString(), 10)].getAttribute('data-simplified-width'),10);
                            if (previousWidth) {
                                overflowItems[parseInt(i.toString(), 10)].setAttribute('data-simplified-width', isHidden ? (previousWidth - hiddenItem).toString() : (previousWidth + hiddenItem).toString());
                            }
                        }
                    }
                }
            }
        }
        if (this.overflowDDB) {
            let selectedOFTab: HTMLElement = document.querySelector('#' + this.tabs[parseInt(tabIndex.toString(), 10)].id + constants.OVERFLOW_ID) as HTMLElement;
            const overflowEle: HTMLElement = this.overflowDDB.target as HTMLElement;
            let overflowItems: NodeListOf<Element> = overflowEle.querySelectorAll('.e-ribbon-item');
            for (let i: number = 0; i < overflowItems.length; i++) {
                let ofTab: HTMLElement = overflowItems[parseInt(i.toString(), 10)].closest('#' + this.tabs[parseInt(tabIndex.toString(), 10)].id + constants.OVERFLOW_ID) as HTMLElement;
                if (selectedOFTab && ofTab && selectedOFTab.id === ofTab.id) {
                    let previousWidth = parseInt(overflowItems[parseInt(i.toString(), 10)].getAttribute('data-simplified-width'),10);
                    if (previousWidth) {
                        overflowItems[parseInt(i.toString(), 10)].setAttribute('data-simplified-width', isHidden ? (previousWidth - hiddenItem).toString() : (previousWidth + hiddenItem).toString());
                    }
                }
            }
        }
    }

    /**
     * Disables a specific group within a ribbon tab.
     *
     * @param {string} groupID - The ID of the group to be disabled.
     * @returns {void}
     */
    public disableGroup(groupID: string): void {
        this.enableDisableGroup(groupID, true);
    }

    /**
     * Enables a specific group within a ribbon tab.
     *
     * @param {string} groupID - The ID of the group to be enabled.
     * @returns {void}
     */
    public enableGroup(groupID: string): void {
        this.enableDisableGroup(groupID, false);
    }

    private enableDisableGroup(groupID: string, isDisabled: boolean): void {
        let overflowDDB: DropDownButton;
        let overflowtarget: HTMLElement;
        const itemProp: itemProps = getGroup(this.tabs, groupID);
        if (!itemProp) { return; }
        const contentEle: HTMLElement = this.tabObj.items[itemProp.tabIndex].content as HTMLElement;
        const groupEle: HTMLElement = contentEle.querySelector('#' + groupID);
        if (groupEle) {
            isDisabled ? groupEle.classList.add('e-disabled') : groupEle.classList.remove('e-disabled');
        }
        else {
            this.updateInitialProps(itemProp.tabIndex, groupID, 'disabledGroups', isDisabled);
        }
        if (this.overflowDDB) {
            const overflowEle: HTMLElement = this.overflowDDB.target as HTMLElement;
            const ofTabContainer: HTMLElement = overflowEle.querySelector('#' + this.tabs[parseInt(itemProp.tabIndex.toString(), 10)].id + constants.OVERFLOW_ID);
            if (itemProp.group.enableGroupOverflow) {
                const overflowDDBEle: HTMLElement = contentEle.querySelector('#' + groupID + constants.GROUPOF_BUTTON_ID);
                if (overflowDDBEle) {
                    overflowDDB = getInstance(overflowDDBEle, DropDownButton) as DropDownButton;
                    overflowtarget = overflowDDB.target as HTMLElement;
                }
                if (overflowtarget) {
                    isDisabled ? overflowtarget.classList.add('e-disabled') : overflowtarget.classList.remove('e-disabled');
                }
            }
            else if (ofTabContainer) {
                const grpContainer: HTMLElement = ofTabContainer.querySelector('#' + groupID + constants.CONTAINER_ID);
                if (grpContainer) {
                    isDisabled ? grpContainer.classList.add('e-disabled') : grpContainer.classList.remove('e-disabled');
                }
            }
        }
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

    /**
     * Hides a specific ribbon item.
     *
     * @param {string} itemId - The ID of the item to be hidden.
     * @returns {void}
     */
    public hideItem(itemId: string): void {
        this.showHideItem(itemId, true);
    }

    /**
     * Shows a specific ribbon item.
     *
     * @param {string} itemId - The ID of the item to be shown.
     * @returns {void}
     */
    public showItem(itemId: string): void {
        this.showHideItem(itemId, false);
    }

    private showHideItem(itemId: string, isHidden: boolean): void {
        const itemProp: itemProps = getItem(this.tabs, itemId);
        if (!itemProp) { return; }
        let ele: HTMLElement;
        if (itemProp.item.type === 'GroupButton') {
            ele = getItemElement(this, itemId + constants.RIBBON_GROUP_BUTTON_ID, itemProp);
        }
        else {
            ele = getItemElement(this, itemId, itemProp);
        }
        if (ele) {
            const itemEle: HTMLElement = closest(ele, '.e-ribbon-item') as HTMLElement;
            this.updateHiddenElements(itemProp.tabIndex, isHidden ? 'hideItem' : 'showItem', itemId, isHidden, itemEle, itemProp.group);
            if (this.selectedTab === itemProp.tabIndex) {
                this.refreshLayout();
            }
        }
        else {
            this.updateInitialProps(itemProp.tabIndex, itemId, 'hiddenItems', isHidden);
        }
    }

    private updateInitialProps(tabIndex: number, id: string, key: string, isInsert: boolean): void {
        let initialProps = this.initialPropsData[parseInt(tabIndex.toString(), 10)] as {[key: string]: object};
        if (!initialProps) {
            this.initialPropsData[parseInt(tabIndex.toString(), 10)] = {};
            initialProps = this.initialPropsData[parseInt(tabIndex.toString(), 10)] as {[key: string]: object};
        }
        if (initialProps) {
            /* eslint-disable */
            if (!initialProps[key])
                initialProps[key] = [];

            const itemIndex: number = (initialProps[key] as string[]).indexOf(id);
            if (isInsert) {
                if (itemIndex === -1)
                    (initialProps[key] as string[]).push(id);
            } else {
                if (itemIndex !== -1)
                    (initialProps[key] as string[]).splice(itemIndex, 1);
                (initialProps[key] as string[]).length === 0 && delete initialProps[key];
                /* eslint-enable */
                if (Object.keys(initialProps).length === 0) {
                    delete this.initialPropsData[parseInt(tabIndex.toString(), 10)];
                }
            }
        }
    }

    private checkHiddenItems(group: RibbonGroupModel, isHidden: boolean, tabIndex: number): void {        
        let isItemsHidden: boolean = true;
        let isEmptyCollection: boolean
        const contentEle: HTMLElement = this.tabObj.items[parseInt(tabIndex.toString(), 10)].content as HTMLElement;
        const groupEle: HTMLElement = contentEle.querySelector('#' + group.id);
        if (isHidden) {
            for (let i:number = 0; i < group.collections.length; i++) {
                if (isItemsHidden) { 
                    const collection: RibbonCollectionModel = group.collections[parseInt(i.toString(), 10)];
                    for (let j:number = 0; j < collection.items.length; j++) {
                        const item: RibbonItemModel = collection.items[parseInt(j.toString(), 10)];                    
                        let itemEle: HTMLElement;
                        if (item.type === 'GroupButton') {
                            const itemProp: itemProps = getItem(this.tabs, item.id);
                            itemEle = getItemElement(this, item.id + constants.RIBBON_GROUP_BUTTON_ID, itemProp);
                        }
                        else {
                            itemEle = getItemElement(this, item.id);
                        }
                        let itemContainer: HTMLElement = itemEle ? itemEle.closest('.e-ribbon-item') as HTMLElement : null;
                        if (!(itemContainer.classList.contains('e-hidden'))) {
                            isItemsHidden = false;
                            break;
                        }
                    }
                }
            }
            if (isItemsHidden) {
                groupEle.classList.add('e-hide-group');
                this.checkOverflowItems(isHidden, contentEle, group.enableGroupOverflow, tabIndex, group.id)
            }
        }
        else {
            groupEle.classList.remove('e-hide-group');
            this.checkOverflowItems(isHidden, contentEle, group.enableGroupOverflow, tabIndex, group.id)
        }
        if (this.activeLayout === 'Simplified' && !group.enableGroupOverflow) {
            let itemsLength: NodeListOf<Element> = groupEle.querySelectorAll('.' + constants.RIBBON_ITEM)
            if (itemsLength) {
                isEmptyCollection = this.checkEmptyCollection(itemsLength);
                groupEle.classList[isEmptyCollection ? 'add' : 'remove']('e-ribbon-emptyCollection');
            }
        }
    }

    private checkOverflowItems(isHidden: boolean, contentEle: HTMLElement, isGroupOF: boolean, tabIndex: number, groupID: string): void {
        let overflowDDB: DropDownButton;
        let overflowtarget: HTMLElement;
        if (isGroupOF) {
            const overflowDDBEle: HTMLElement = contentEle.querySelector('#' + groupID + constants.GROUPOF_BUTTON_ID);
            if (overflowDDBEle) {
                overflowDDB = getInstance(overflowDDBEle, DropDownButton) as DropDownButton;
                overflowtarget = overflowDDB.target as HTMLElement;
            }
            if (overflowtarget) {
                isHidden ? overflowtarget.classList.add('e-hide-group') : overflowtarget.classList.remove('e-hide-group');
            }
        }
        else {
            if (this.overflowDDB) {
                const overflowEle: HTMLElement = this.overflowDDB.target as HTMLElement;
                const ofTabContainer: HTMLElement = overflowEle.querySelector('#' + this.tabs[parseInt(tabIndex.toString(), 10)].id + constants.OVERFLOW_ID);
                if (ofTabContainer) {
                    const grpContainer: HTMLElement = ofTabContainer.querySelector('#' + groupID + constants.CONTAINER_ID);
                    if (grpContainer) {
                        isHidden ? grpContainer.classList.add('e-hide-group') : grpContainer.classList.remove('e-hide-group');
                    }
                }
            }
        }
    }

    /**
     * tab - Gets the ribbon tab to be updated. The id of the tab is a required property. Other properties are optional.
     *
     * @param {RibbonTabModel} tab - Gets the ribbon tab model.
     * @returns {void}
     */

    public updateTab(tab: RibbonTabModel): void {
        const tabId: string = tab.id;
        const index: number = getIndex(this.tabs, (e: RibbonTab) => { return e.id === tabId; });
        if (index === -1) { return; }
        const contentEle: HTMLElement = this.tabObj.items[parseInt(index.toString(), 10)].content as HTMLElement;
        const groups: RibbonGroupModel[] = this.tabs[parseInt(index.toString(), 10)].groups;
        const tabEle: HTMLElement = this.tabObj.element;
        if (groups && (contentEle.innerHTML !== '')) {
            // Check whether cssClass is passed by the user, and if it is, then remove the old values.
            if (tab.cssClass) {
                if (this.tabs[parseInt(index.toString(), 10)].cssClass) {
                    contentEle.classList.remove(this.tabs[parseInt(index.toString(), 10)].cssClass);
                    tabEle.querySelector('.e-active').classList.remove(this.tabs[parseInt(index.toString(), 10)].cssClass);
                }
            }
            // Check whether group is passed by the user, and if it is, then remove the old values.
            if (tab.groups) {
                for (const group of groups) {
                    const dropdownElement: HTMLElement = group.isCollapsed ? contentEle.querySelector('#' + group.id + constants.OVERFLOW_ID + constants.DROPDOWN_ID) : null;
                    for (const collection of group.collections) {
                        for (const item of collection.items) {
                            let ele: HTMLElement = dropdownElement ? this.ribbonDropDownModule.getDDBItemElement(dropdownElement, item.id) : contentEle.querySelector('#' + item.id);
                            if (item.type === RibbonItemType.GroupButton && this.activeLayout === 'Classic') {
                                ele = dropdownElement ? this.ribbonDropDownModule.getDDBItemElement(dropdownElement, item.id + constants.RIBBON_GROUP_BUTTON_ID) :
                                    contentEle.querySelector('#' + item.id + constants.RIBBON_GROUP_BUTTON_ID);
                            }
                            if (ele) {
                                this.destroyFunction(item, ele);
                            }
                        }
                    }
                    if (dropdownElement) { this.ribbonDropDownModule.removeOverFlowDropDown(dropdownElement); }
                }
                const groupElements : NodeListOf<HTMLElement> = contentEle.querySelectorAll('.e-ribbon-group');
                // eslint-disable-next-line @typescript-eslint/tslint/config
                groupElements.forEach(groupEle => { groupEle.remove(); });
            }
        }
        if (index === this.selectedTab) {
            this.isAddRemove = true;
        }
        const ribbonTab: RibbonTab = this.tabs[parseInt(index.toString(), 10)] as RibbonTab;
        ribbonTab.setProperties(tab, true);
        this.setProperties({ groups: this.checkID(ribbonTab.groups, 'group', ribbonTab.id) }, true);
        this.validateItemSize();
        if (contentEle.innerHTML === '') {
            // Check whether group is passed by the user and sets the updated values.
            if (tab.groups) {
                const elements: HTMLElement[] = this.createGroups(ribbonTab.groups, index);
                append(elements, contentEle);
            }
            if (this.selectedTab === index) { this.refreshLayout(); }
            // Check whether cssClass is passed by the user and sets the updated values.
            if (tab.cssClass) {
                contentEle.classList.add(ribbonTab.cssClass);
                tabEle.querySelector('.e-active').classList.add(ribbonTab.cssClass);
            }
            // Check whether header is passed by the user and sets the updated values.
            if (tab.header) {
                tabEle.querySelector<HTMLElement>('#' + tabId + constants.HEADER_ID).innerText = ribbonTab.header;
            }
        }
    }

    /**
     * group - Gets the ribbon group to be updated. The id of the group is a required property. Other properties are optional.
     *
     * @param {RibbonGroupModel} group - Gets the ribbon group model.
     * @returns {void}
     */

    public updateGroup(group: RibbonGroupModel): void {
        const groupId: string = group.id;
        const itemProp: itemProps = getGroup(this.tabs, groupId);
        if (!itemProp) { return; }
        if (this.selectedTab === itemProp.tabIndex) { this.clearOverflowResize(); }
        //Check whether the tab items are rendered
        const contentEle: HTMLElement = this.tabObj.items[itemProp.tabIndex].content as HTMLElement;
        const groupEle: HTMLElement = contentEle.querySelector('#' + groupId);
        const groupContainer: HTMLElement = groupEle.querySelector('#' + group.id + constants.CONTAINER_ID);
        let dropdownElement: HTMLElement;
        let dropdown: DropDownButton;
        if (contentEle.innerHTML !== '') {
            if (itemProp.group.showLauncherIcon) { this.removeLauncherIcon(itemProp.group.id, null, contentEle); }
            if (this.activeLayout === RibbonLayout.Simplified) {
                dropdownElement = itemProp.group.enableGroupOverflow ?
                    contentEle.querySelector('#' + itemProp.group.id + constants.GROUPOF_BUTTON_ID) : null;
                dropdown = dropdownElement ? getComponent(dropdownElement, DropDownButton) : this.overflowDDB;
            }
            // Check whether cssClass is passed by the user, and if it is, then remove the old values.
            if (group.cssClass) {
                if (itemProp.group.cssClass) {
                    groupEle.classList.remove(itemProp.group.cssClass);
                    if (groupContainer) { groupContainer.classList.remove(itemProp.group.cssClass); }
                }
            }
            // Check whether collections or orientation is passed by the user, and if it is, then remove the old values.
            if (group.collections || group.orientation) {
                if (itemProp.group.collections || itemProp.group.orientation) {
                    for (const collection of itemProp.group.collections) {
                        for (const item of collection.items) {
                            this.removeItemElement(contentEle, item, dropdown);
                        }
                    }
                    const collectionElements: NodeListOf<HTMLElement> =  groupEle.querySelectorAll('.e-ribbon-collection');
                    // eslint-disable-next-line @typescript-eslint/tslint/config
                    collectionElements.forEach(collectionEle => { collectionEle.remove(); });
                    if (group.orientation) {
                        const groupContent: HTMLElement = groupContainer.querySelector('.e-ribbon-group-content');
                        const removeCss: string[] = groupContent.classList.value.match(/(e-ribbon-[column|row]+)/g);
                        if (removeCss) { removeClass([groupContent], removeCss); }
                    }
                }
            }
            if (this.activeLayout === RibbonLayout.Simplified) {
                if (itemProp.group.enableGroupOverflow) {
                    if ((dropdown.target as HTMLElement).childElementCount === 0 || ((dropdown.target as HTMLElement).childElementCount === 1 && this.isHeaderVisible(dropdown.target as HTMLElement, itemProp.group.id))) {
                        this.removeOverflowButton(dropdown);
                    }
                } else {
                    const ofGroupContainer: HTMLElement = (dropdown.target as HTMLElement).querySelector('#' + itemProp.group.id + constants.CONTAINER_ID);
                    if (ofGroupContainer && ofGroupContainer.childElementCount === 1) { ofGroupContainer.remove(); }
                    const ofTabContainer: HTMLElement = (dropdown.target as HTMLElement).querySelector('#' + this.tabs[parseInt(itemProp.tabIndex.toString(), 10)].id + constants.OVERFLOW_ID);
                    if (ofTabContainer && ofTabContainer.childElementCount === 0) { ofTabContainer.remove(); }
                }
            }
        }
        const ribbongroup: RibbonGroup = itemProp.group as RibbonGroup;
        ribbongroup.setProperties(group, true);
        ribbongroup.setProperties({ collections: this.checkID(ribbongroup.collections, 'collection', ribbongroup.id) }, true);
        this.validateItemSize();
        if (contentEle.innerHTML !== '') {
            // Check whether showLauncherIcon or orientation is passed by the user and sets the updated values.
            if (group.showLauncherIcon) { this.createLauncherIcon(ribbongroup.id, groupContainer); }
            // Check whether collections or orientation is passed by the user and sets the updated values.
            if (group.collections || group.orientation) {
                const groupContent: HTMLElement = groupContainer.querySelector('.e-ribbon-group-content');
                groupContent.classList.add(((ribbongroup.orientation === 'Column') || (this.activeLayout === 'Simplified')) ? constants.RIBBON_COLUMN : constants.RIBBON_ROW);
                const elements: HTMLElement[] = this.createCollection(ribbongroup.collections, ribbongroup.orientation
                    , ribbongroup.id, ribbongroup.header, ribbongroup.enableGroupOverflow, itemProp.tabIndex, groupContainer);
                append(elements, groupContent);
            }
            if (this.selectedTab === itemProp.tabIndex) { this.refreshLayout(); }
            // Check whether cssClass is passed by the user and sets the updated values.
            if (group.cssClass) {
                groupEle.classList.add(ribbongroup.cssClass);
                if (groupContainer) { groupContainer.classList.add(ribbongroup.cssClass); }
            }
            // Check whether header is passed by the user and sets the updated values.
            if (group.header) {
                if (this.activeLayout === RibbonLayout.Simplified && !group.enableGroupOverflow) {
                    const overflowHeader: HTMLElement = (dropdown.target as HTMLElement).querySelector('#' + group.id + constants.HEADER_ID);
                    if (overflowHeader) { overflowHeader.innerText = ribbongroup.header; }
                }
                else if (this.activeLayout === RibbonLayout.Classic && !ribbongroup.isCollapsed) {
                    groupEle.querySelector<HTMLElement>('.e-ribbon-group-header').innerText = ribbongroup.header;
                }
                else if (this.activeLayout === RibbonLayout.Classic && ribbongroup.isCollapsed) {
                    const overflowEle: HTMLElement =  groupEle.querySelector('#' + ribbongroup.id + constants.OVERFLOW_ID + constants.DROPDOWN_ID);
                    // need to set instance for dropdown
                    const dropDownBtn: DropDownButton = getInstance(overflowEle, DropDownButton) as DropDownButton;
                    const overflowHeader: HTMLElement = (dropDownBtn.target as HTMLElement).querySelector('#' + group.id + constants.HEADER_ID);
                    if (overflowHeader) { overflowHeader.innerText = ribbongroup.header; }
                }
            }
        }
    }

    /**
     * collection - Gets the ribbon collection to be updated. The id of the collection is a required property. Other properties are optional.
     *
     * @param {RibbonCollectionModel} collection - Gets the ribbon collection model.
     * @returns {void}
     */

    public updateCollection(collection: RibbonCollectionModel): void {
        const collectionId: string = collection.id;
        const itemProp: itemProps = getCollection(this.tabs, collectionId);
        if (!itemProp) { return; }
        if (this.selectedTab === itemProp.tabIndex) { this.clearOverflowResize(); }
        //Check whether the tab items are rendered
        const contentEle: HTMLElement = this.tabObj.items[itemProp.tabIndex].content as HTMLElement;
        const collectionEle: HTMLElement = contentEle.querySelector('#' + collectionId);
        if (contentEle.innerHTML !== '') {
            let dropdownElement: HTMLElement;
            let dropdown: DropDownButton;
            if (this.activeLayout === RibbonLayout.Simplified) {
                dropdownElement = itemProp.group.enableGroupOverflow ?
                    contentEle.querySelector('#' + itemProp.group.id + constants.GROUPOF_BUTTON_ID) : null;
                dropdown = dropdownElement ? getComponent(dropdownElement, DropDownButton) : this.overflowDDB;
            }
            // Check whether cssClass is passed by the user, and if it is, then remove the old values.
            if (collection.cssClass) {
                if (itemProp.collection.cssClass) { collectionEle.classList.remove(itemProp.collection.cssClass); }
            }
            if (collection.items) {
                if (itemProp.collection.items) {
                    for (const item of itemProp.collection.items) {
                        this.removeItemElement(contentEle, item, dropdown);
                    }
                }
            }
        }
        const ribboncollection: RibbonCollection = itemProp.collection as RibbonCollection;
        ribboncollection.setProperties(collection, true);
        ribboncollection.setProperties({ items: this.checkID(ribboncollection.items, 'item', ribboncollection.id) }, true);
        this.validateItemSize();
        if (contentEle.innerHTML !== '') {
            if (collection.items) {
                const groupContainer: HTMLElement = contentEle.querySelector('#' + itemProp.group.id + constants.CONTAINER_ID);
                const elements: HTMLElement[] = this.createItems(ribboncollection.items, itemProp.group.orientation, itemProp.group.id,
                                                                 itemProp.group.header, itemProp.group.enableGroupOverflow,
                                                                 itemProp.tabIndex, groupContainer);
                append(elements, collectionEle);
            }
        }
        if (this.selectedTab === itemProp.tabIndex) { this.refreshLayout(); }
        // Check whether cssClass is passed by the user and sets the updated values.
        if (collection.cssClass) { collectionEle.classList.add(ribboncollection.cssClass); }
    }

    /**
     * item - Gets the ribbon item to be updated. The id of the item is a required property. Other properties are optional.
     *
     * @param {RibbonItemModel} item - Gets the ribbon item model.
     * @returns {void}
     */

    public updateItem(item: RibbonItemModel): void {
        const itemId: string = item.id;
        const itemProp: itemProps = getItem(this.tabs, itemId);
        if (!itemProp) { return; }
        if (this.selectedTab === itemProp.tabIndex) { this.clearOverflowResize(); }
        //Check whether the tab items are rendered
        const contentEle: HTMLElement = this.tabObj.items[itemProp.tabIndex].content as HTMLElement;
        const groupEle: HTMLElement = contentEle.querySelector('#' + itemProp.group.id);
        const groupContainer: HTMLElement = groupEle.querySelector('#' + itemProp.group.id + constants.CONTAINER_ID);
        let itemContainer: HTMLElement = null;
        let itemEle: HTMLElement = null;
        let dropdownElement: HTMLElement;
        let dropdown: DropDownButton;
        if (contentEle.innerHTML !== '') {
            if (this.activeLayout === RibbonLayout.Simplified) {
                dropdownElement = itemProp.group.enableGroupOverflow ?
                    contentEle.querySelector('#' + itemProp.group.id + constants.GROUPOF_BUTTON_ID) : null;
                dropdown = dropdownElement ? getComponent(dropdownElement, DropDownButton) : this.overflowDDB;
            }
            if (this.activeLayout === RibbonLayout.Simplified && itemProp.item.displayOptions === DisplayMode.Overflow) {
                itemContainer = (dropdown.target as HTMLElement).querySelector('#' + itemId + constants.CONTAINER_ID);
                itemEle = (dropdown.target as HTMLElement).querySelector('#' + itemId);
                if (item.displayOptions && item.displayOptions !== DisplayMode.Overflow) {
                    const collectionEle : HTMLElement = groupContainer.querySelector('#' + itemProp.collection.id);
                    if (collectionEle) { collectionEle.appendChild(itemContainer); }
                }
            } else {
                itemContainer = groupContainer.querySelector('#' + itemId + constants.CONTAINER_ID);
                itemEle = contentEle.querySelector('#' + itemId);
                if (itemProp.item.type === 'GroupButton' && this.activeLayout === RibbonLayout.Classic) {
                    itemEle = contentEle.querySelector('#' + itemId + constants.RIBBON_GROUP_BUTTON_ID);
                }
                if (this.activeLayout === RibbonLayout.Simplified && item.displayOptions === DisplayMode.Overflow) {
                    this.createOverflowPopup(itemProp.item, itemProp.tabIndex, itemProp.group.enableGroupOverflow, itemProp.group.id,
                                             itemProp.group.header, itemContainer, groupContainer);
                    if ((itemProp.item.type === RibbonItemType.DropDown) || (itemProp.item.type === RibbonItemType.SplitButton) || (item.type === RibbonItemType.GroupButton)) {
                        this.updatePopupItems(itemProp.item, itemContainer, itemProp.group.enableGroupOverflow, true);
                    }
                }
            }
            // Check whether cssClass is passed by the user, and if it is, then remove the old values.
            if (item.cssClass) {
                if (itemProp.item.cssClass) { itemContainer.classList.remove(itemProp.item.cssClass); }
            }
            this.destroyFunction(itemProp.item, itemEle);
            itemEle.remove();
            const removeCss: string[] = itemContainer.classList.value.match(/(e-ribbon-[large|medium|small]+-item)/g);
            if (removeCss) { removeClass([itemContainer], removeCss); }
        }
        const ribbonItem: RibbonItem = itemProp.item as RibbonItem;
        ribbonItem.setProperties(item, true);
        this.validateItemSize();
        if (contentEle.innerHTML !== '') {
            if (!(this.activeLayout === RibbonLayout.Simplified && ribbonItem.displayOptions === DisplayMode.Overflow)) {
                itemContainer = groupContainer.querySelector('#' + itemId + constants.CONTAINER_ID);
            } else {
                itemContainer = (dropdown.target as HTMLElement).querySelector('#' + itemId + constants.CONTAINER_ID);
            }
            // To avoid undefined items condition is added
            if (ribbonItem.ribbonTooltipSettings && isTooltipPresent(ribbonItem.ribbonTooltipSettings)) {
                itemContainer.classList.add(constants.RIBBON_TOOLTIP_TARGET);
                this.tooltipData.push({ id: itemContainer.id, data: ribbonItem.ribbonTooltipSettings });
            }
            let size: RibbonItemSize = ribbonItem.activeSize;
            if (this.activeLayout === 'Simplified') {
                size = ((ribbonItem.allowedSizes === RibbonItemSize.Large) || (ribbonItem.allowedSizes & RibbonItemSize.Medium) ||
                    (ribbonItem.displayOptions === DisplayMode.Overflow)) ? RibbonItemSize.Medium : RibbonItemSize.Small;
                (ribbonItem as RibbonItem).setProperties({ activeSize: size }, true);
            }
            if (size & RibbonItemSize.Large) {
                itemContainer.classList.add(constants.RIBBON_LARGE_ITEM, constants.RIBBON_CONTENT_HEIGHT);
            } else {
                itemContainer.classList.add((size & RibbonItemSize.Medium) ? constants.RIBBON_MEDIUM_ITEM : constants.RIBBON_SMALL_ITEM);
            }
            this.createRibbonItem(ribbonItem, itemContainer);
            if (this.activeLayout === 'Simplified' && itemProp.group.enableGroupOverflow) {
                if ((dropdown.target as HTMLElement).childElementCount === 0 || ((dropdown.target as HTMLElement).childElementCount === 1 && this.isHeaderVisible(dropdown.target as HTMLElement, itemProp.group.id))) {
                    this.removeOverflowButton(dropdown);
                }
            }
            if (this.selectedTab === itemProp.tabIndex) { this.refreshLayout(); }
            if (item.cssClass) { itemContainer.classList.add(ribbonItem.cssClass); }
            if (!(ribbonItem.disabled) && itemContainer.classList.contains(constants.DISABLED_CSS)) {
                itemContainer.classList.remove(constants.DISABLED_CSS);
            }
            this.enableDisableItem(ribbonItem.id, ribbonItem.disabled);
        }
    }

    private removeItemElement(contentEle: HTMLElement, item: RibbonItemModel, dropdown: DropDownButton): void {
        let ele: HTMLElement = null;
        if (this.activeLayout === RibbonLayout.Classic) {
            ele = (item.displayOptions & DisplayMode.Classic) ? contentEle.querySelector('#' + item.id) : null;
            if (item.type === 'GroupButton') {
                ele = (item.displayOptions & DisplayMode.Classic) ? contentEle.querySelector('#' + item.id + constants.RIBBON_GROUP_BUTTON_ID) : null;
            }
        } else {
            //Checks for Simplified and Auto options (Auto = classic + simplified + popup)
            ele = (item.displayOptions & DisplayMode.Simplified) ? contentEle.querySelector('#' + item.id) : null;
            // element will be null for "Popup" and if the item is moved to overflow in "Auto" mode
            if (!ele) {
                ele = (dropdown.target as HTMLElement).querySelector('#' + item.id);
            }
        }
        if (ele) {
            this.destroyFunction(item, ele);
            if (item.type === 'GroupButton' && this.activeLayout === RibbonLayout.Simplified) {
                document.getElementById(item.id + constants.CONTAINER_ID).remove();
            }
            else {
                ele.closest('#' + item.id + constants.CONTAINER_ID).remove();
            }
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
        let isUpdated: boolean = false;
        const itemProp: itemProps = getItem(this.tabs, itemId);
        if (!itemProp) { return; }
        (itemProp.item as RibbonItem).setProperties({ disabled: isDisabled }, true);
        let ele: HTMLElement;
        if (itemProp.item.type === 'GroupButton') {
            ele = getItemElement(this, itemId + constants.RIBBON_GROUP_BUTTON_ID, itemProp);
        }
        else {
            ele = getItemElement(this, itemId, itemProp);
        }
        if (ele) {
            const itemEle: HTMLElement = closest(ele, '.e-ribbon-item') as HTMLElement;
            const moduleName: string = this.getItemModuleName(itemProp.item);
            isUpdated = isDisabled ? !itemEle.classList.contains(constants.DISABLED_CSS) : itemEle.classList.contains(constants.DISABLED_CSS);
            if (moduleName !== 'template') {
                if (isUpdated) {
                    if (moduleName === 'group-btn' && this.activeLayout === 'Simplified') {
                        updateControlDisabled(ele, 'dropdown-btn', isDisabled);
                        for (let i: number = 0; i < itemProp.item.groupButtonSettings.items.length; i++) {
                            const btnEle: HTMLElement = document.querySelector('#' + itemId + constants.RIBBON_GROUP_BUTTON_ID + i);
                            updateControlDisabled(btnEle, 'btn', isDisabled);
                        }
                    }
                    else if (moduleName === 'group-btn' && this.activeLayout === 'Classic') {
                        for (let i: number = 0; i < itemProp.item.groupButtonSettings.items.length; i++) {
                            const btnEle: HTMLElement = ele.querySelector('#' + itemId + constants.RIBBON_GROUP_BUTTON_ID + i);
                            updateControlDisabled(btnEle, 'btn', isDisabled);
                        }
                    }
                    else {
                        updateControlDisabled(ele, moduleName, isDisabled);
                    }
                }
            } else {
                ele.classList.toggle(constants.DISABLED_CSS, isDisabled);
                ele.toggleAttribute('disabled', isDisabled);
            }
            itemEle.classList.toggle(constants.DISABLED_CSS, itemProp.item.disabled);
        }
    }

    private unwireEvents(): void {
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'resize', this.resizeHandler);
    }

    public destroy(): void {
        this.keyboardModuleRibbon.destroy();
        this.keyboardModuleRibbon = null;
        destroyTooltip(this.element);
        if (this.refreshing) { this.clearOverflowDropDown(this.selectedTab); }
        this.destroyTabItems(this.tabs);
        if (!this.hideLayoutSwitcher) { this.removeExpandCollapse(); }
        this.collapseButton = undefined;
        if (this.scrollModule) {
            this.scrollModule.destroy();
            this.scrollModule = null;
        }
        if (this.ribbonTempEle) {
            remove(this.ribbonTempEle);
            this.ribbonTempEle = null;
        }
        super.destroy();
        this.tabObj.destroy();
        this.tabObj = undefined;
        this.initialPropsData = {};
        this.hiddenGroups = [];
        this.hiddenElements = {};
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
                if (!this.isMinimized) { this.refreshLayout(); }
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
                                    const element: HTMLElement = tabContent.querySelector('#' + group.id + constants.OVERFLOW_ID + constants.DROPDOWN_ID);
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
                this.reRenderTabs(newProp.tabs);
                break;
            case 'width':
                this.element.style.width = formatUnit(newProp.width);
                this.refreshLayout();
                break;
            case 'fileMenu':
                if (this.ribbonFileMenuModule) { this.ribbonFileMenuModule.updateFileMenu(this.fileMenu); }
                const toolbarEle: Toolbar = this.tabObj['tbObj'] as Toolbar;
                toolbarEle.refreshOverflow();
                break;
            case 'backStageMenu':
                if (this.ribbonBackstageModule) { this.ribbonBackstageModule.updateBackStageMenu(this.backStageMenu); }
                const toolbarElement: Toolbar = this.tabObj['tbObj'] as Toolbar;
                toolbarElement.refreshOverflow();
                break;
            case 'helpPaneTemplate':
                if (this.ribbonTempEle) {
                    remove(this.ribbonTempEle);
                    this.ribbonTempEle = null;
                    this.tabObj.element.style.setProperty(constants.RIBBON_HELP_PANE_TEMPLATE_WIDTH, '0px');
                }
                if (this.helpPaneTemplate) {
                    this.createHelpPaneTemplate();
                }
                const toolbar: Toolbar = this.tabObj['tbObj'] as Toolbar;
                toolbar.refreshOverflow();
                break;
            case 'hideLayoutSwitcher':
                this.hideLayoutSwitcher ? this.removeExpandCollapse() : this.addExpandCollapse();
                break;
            }
        }
    }
}
