import { addClass, append, Event, Collection, Complex, Component, EmitType, EventHandler, formatUnit, getInstance, getComponent, getUniqueID, closest, KeyboardEventArgs, KeyboardEvents } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, isNullOrUndefined, isUndefined, ModuleDeclaration, NotifyPropertyChanges, Property, remove, removeClass } from '@syncfusion/ej2-base';import { Tab, TabAnimationSettings, TabAnimationSettingsModel, TabItemModel, SelectEventArgs, SelectingEventArgs, HScroll, Toolbar } from '@syncfusion/ej2-navigations';import { RibbonTab, RibbonTabModel, RibbonGroupModel, RibbonCollectionModel, RibbonItemModel, FileMenuSettings, FileMenuSettingsModel, BackStageMenu, BackStageMenuModel, RibbonItem, RibbonCollection, RibbonGroup, RibbonContextualTabSettingsModel, RibbonContextualTabSettings } from '../models/index';import { commonProperties, DisplayMode, ExpandCollapseEventArgs, itemProps, LauncherClickEventArgs, LayoutSwitchedEventArgs, OverflowPopupEventArgs, ribbonItemPropsList, RibbonLayout, ribbonTooltipData, TabSelectedEventArgs, TabSelectingEventArgs } from './interface';import { ItemOrientation, RibbonItemSize, RibbonItemType, KeyTipDataType } from './interface';import { RibbonButton, RibbonComboBox, RibbonCheckBox, RibbonDropDown, RibbonColorPicker, RibbonSplitButton, RibbonGroupButton } from '../items/index';import { destroyControl, getCollection, getGroup, getIndex, getItem, getItemElement, updateCommonProperty, updateControlDisabled, isTooltipPresent, getTemplateFunction, createTooltip, destroyTooltip, updateTooltipProp } from './utils';import * as constants from './constant';import { RibbonFileMenu, RibbonBackstage, RibbonKeyTip } from '../modules/index';import { RibbonTooltipModel } from '../models/ribbon-tooltip-model';import { Popup } from '@syncfusion/ej2-popups';import { BeforeOpenCloseMenuEventArgs, DropDownButton, SplitButton } from '@syncfusion/ej2-splitbuttons';import { CheckBox } from '@syncfusion/ej2-buttons';import { RibbonContextualTab } from '../modules/ribbon-contextualtab';import { RibbonGallery } from '../items/ribbon-gallery';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Ribbon
 */
export interface RibbonModel extends ComponentModel{

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
    activeLayout?: RibbonLayout | string;

    /**
     * Defines one or more CSS classes to customize the appearance of ribbon.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Defines whether to enable the key tip or not.
     *
     * @default false
     */
    enableKeyTips?: boolean;

    /**
     * Defines the key tip text for the layoutSwitcher icon.
     *
     * @default ''
     */
    layoutSwitcherKeyTip?: string;

    /**
     * Defines the properties of ribbon file menu.
     *
     * @default {}
     */
    fileMenu?: FileMenuSettingsModel;

    /**
     * Defines the properties of ribbon backstage.
     *
     * @default {}
     */
    backStageMenu?: BackStageMenuModel;

    /**
     * Defines the icon CSS for the launcher icon button in group header.
     *
     * @default ''
     */
    launcherIconCss?: string;

    /**
     * Specifies whether the ribbon is minimized or not.
     * When minimized, only the tab header is shown.
     *
     * @default false
     */
    isMinimized?: boolean;

    /**
     * Provides the localization value for the controls present in ribbon items.
     *
     * @default 'en-us'
     */
    locale?: string;

    /**
     * Specifies the index of the current active tab.
     *
     * @default 0
     */
    selectedTab?: number;

    /**
     * Specifies the animation configuration settings for showing the content of the Ribbon Tab.
     *
     * @default { previous: { effect: 'SlideLeftIn', duration: 600, easing: 'ease' },next: { effect: 'SlideRightIn', duration: 600, easing: 'ease' } }
     */
    tabAnimation?: TabAnimationSettingsModel;

    /**
     * Defines the list of ribbon tabs.
     *
     * @default []
     */
    tabs?: RibbonTabModel[];

    /**
     * Defines the properties of ribbon contextual tab.
     *
     * @default []
     */
    contextualTabs?: RibbonContextualTabSettingsModel[];

    /**
     * Specifies the width of the ribbon.
     *
     * @default '100%'
     */
    width?: string | number;

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
    helpPaneTemplate?: string | HTMLElement | Function;

    /**
     * Defines whether to show the layout switcher button or not.
     *
     * @default false
     */
    hideLayoutSwitcher?: boolean;

    /**
     * Event triggers before selecting the tab item.
     *
     * @event tabSelecting
     */
    tabSelecting?: EmitType<TabSelectingEventArgs>;

    /**
     * Event triggers after selecting the tab item.
     *
     * @event tabSelected
     */
    tabSelected?: EmitType<TabSelectedEventArgs>;

    /**
     * Event triggers before expanding the ribbon.
     *
     * @event ribbonExpanding
     */
    ribbonExpanding?: EmitType<ExpandCollapseEventArgs>;

    /**
     * Event triggers before collapsing the ribbon.
     *
     * @event ribbonCollapsing
     */
    ribbonCollapsing?: EmitType<ExpandCollapseEventArgs>;

    /**
     * Event triggers when the ribbon layout is switched.
     *
     * @event ribbonLayoutSwitched
     */
    ribbonLayoutSwitched?: EmitType<LayoutSwitchedEventArgs>;

    /**
     * Event triggers when the launcher icon of the group is clicked.
     *
     * @event launcherIconClick
     */
    launcherIconClick?: EmitType<LauncherClickEventArgs>;

    /**
     * Event triggers once the Ribbon Component rendering is completed.
     *
     * @event created
     */
    created?: EmitType<Event>;

    /**
     * Event triggers when the overflow popup opens.
     *
     * @event overflowPopupOpen
     */
    overflowPopupOpen?: EmitType<OverflowPopupEventArgs>;

    /**
     * Event triggers when the overflow popup closes.
     *
     * @event overflowPopupClose
     */
    overflowPopupClose?: EmitType<OverflowPopupEventArgs>;

}