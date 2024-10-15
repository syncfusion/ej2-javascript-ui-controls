import { BaseEventArgs } from '@syncfusion/ej2-base';
import { RibbonCollectionModel, RibbonGalleryItemModel, RibbonGroupButtonItemModel, RibbonGroupModel, RibbonItemModel, RibbonTooltipModel } from '../models';

/**
 * Defines the layout types of ribbon.
 */
export enum RibbonLayout {
    /**
     * Displays the ribbon tab content in classic layout.
     */
    Classic = 'Classic',
    /**
     * Displays the ribbon tab content in simplified layout.
     */
    Simplified = 'Simplified'
}

/**
 * Defines the alignment of the items in the ribbon group.
 */
export enum ItemOrientation {
    /**
     * Displays the collection of items in rows.
     */
    Row = 'Row',
    /**
     * Displays the collection of items in column.
     */
    Column = 'Column'
}

/**
 * Defines the current size of the ribbon item in normal mode.
 *
 * @aspNumberEnum
 */
export enum RibbonItemSize {
    /**
     * The item appears with large icon and text at the bottom.
     */
    Large = 1 << 2,
    /**
     * The item appears with small icon and text at the right.
     */
    Medium = 1 << 1,
    /**
     * The item appears with small icon only.
     */
    Small = 1 << 0
}

/**
 * Defines how to show an item in ribbon simplified layout.
 *
 * @aspNumberEnum
 */
export enum DisplayMode {
    /**
     * The item appears in the classic layout group.
     */
    Classic = 1 << 2,
    /**
     * The item appears in the simplified layout group.
     */
    Simplified = 1 << 1,
    /**
     * The item appears in overflow popup.
     */
    Overflow = 1 << 0,
    /**
     * The item appears in classic layout group, simplified layout group, and overflow popup based on ribbon overflow state.
     */
    Auto = Classic | Simplified | Overflow,
}

/**
 * Defines the type of the ribbon item.
 */
export enum RibbonItemType {
    /**
     * Renders button as ribbon item.
     */
    Button = 'Button',
    /**
     * Renders checkbox as ribbon item.
     */
    CheckBox = 'CheckBox',
    /**
     * Renders color picker as ribbon item.
     */
    ColorPicker = 'ColorPicker',
    /**
     * Renders combobox as ribbon item.
     */
    ComboBox = 'ComboBox',
    /**
     * Renders dropdownbutton as ribbon item.
     */
    DropDown = 'DropDown',
    /**
     * Renders splitbutton as ribbon item.
     */
    SplitButton = 'SplitButton',
    /**
     * Renders the group button content as ribbon item.
     */
    GroupButton = 'GroupButton',
    /**
     * Renders the gallery as ribbon item.
     */
    Gallery = 'Gallery',
    /**
     * Renders the template content as ribbon item.
     */
    Template = 'Template'
}

/**
 * Defines the alignment of the items in the ribbon group.
 */
export enum RibbonGroupButtonSelection {
    /**
     * Allows selecting single button from button group.
     */
    Single = 'Single',
    /**
     * Allows selecting multiple buttons from button group.
     */
    Multiple = 'Multiple'
}

/**
 * Event triggers before selecting the tab item.
 */
export interface TabSelectingEventArgs extends BaseEventArgs {
    /**
     * Defines whether to cancel the event or not.
     */
    cancel: boolean;
    /**
     * Specifies whether the event is triggered via user interaction or programmatic way.
     */
    isInteracted: boolean;
    /**
     * Defines the index of the previously selected tab.
     */
    previousIndex: number;
    /**
     * Defines the index of the selected tab.
     */
    selectedIndex: number;
    /**
     * Defines whether the tab is a contextual tab.
     */
    isContextual: boolean;
}

/**
 * Event triggers after selecting the tab item.
 */
export interface TabSelectedEventArgs extends BaseEventArgs {
    /**
     *  Defines the index of the previously selected tab.
     */
    previousIndex: number;
    /**
     *  Defines the index of the selected tab.
     */
    selectedIndex: number;
    /**
     * Defines whether the tab is a contextual tab.
     */
    isContextual: boolean;
}

/**
 * Event triggers before expanding and before collapsing the ribbon.
 */
export interface ExpandCollapseEventArgs extends BaseEventArgs {
    /**
     *  Defines whether to cancel the event or not.
     */
    cancel: boolean;
}

/**
 * Event triggers when the ribbon layout is switched.
 */
export interface LayoutSwitchedEventArgs extends BaseEventArgs {
    /**
     *  Specifies the active layout of the ribbon.
     */
    activeLayout: string;
    /**
     *  Provides the actual native event.
     */
    event: Event;
}

/**
 * Event Triggers when the launcher icon is clicked.
 */
export interface LauncherClickEventArgs extends BaseEventArgs {
    /**
     *  Provides the ID of the group in which the launcher icon is present.
     */
    groupId: string;
}

/**
 * Triggers before clicking the button from group button
 */
export interface BeforeClickGroupButtonEventArgs extends BaseEventArgs {
    /**
     *  Defines whether to cancel the event or not.
     */
    cancel: boolean;
    /**
     *  Defines the collection of previous selected group button item(s).
     */
    previousItems: RibbonGroupButtonItemModel[];
    /**
     *  Defines the collection of current selecting group button item(s).
     */
    selectingItems: RibbonGroupButtonItemModel[];
}

/**
 * Triggers after clicking the button from group button.
 */
export interface ClickGroupButtonEventArgs extends BaseEventArgs {
    /**
     *  Defines the collection of previous selected group button item(s).
     */
    previousItems: RibbonGroupButtonItemModel[];
    /**
     *  Defines the collection of current selected group button item(s).
     */
    selectedItems: RibbonGroupButtonItemModel[];
}

/**
 * Triggers before open / close of overflow popup menu.
 */
export interface OverflowPopupEventArgs extends BaseEventArgs {
    /**
     *  Provides the HTML element of the overflow popup.
     */
    element: HTMLElement;
    /**
     *  Defines the original event arguments.
     */
    event: Event;
    /**
     *  Defines whether to cancel the  overflow popup open or close.
     */
    cancel?: boolean;
}

/**
 * Event triggers when the gallery popup open / close.
 */
export interface GalleryPopupEventArgs extends BaseEventArgs {
    /**
     *  Defines whether to cancel the gallery popup open or close.
     */
    cancel: boolean;
    /**
     *  Provides the original event.
     */
    event: Event;
    /**
     *  Specifies name of the event.
     */
    name: string;
}

/**
 * Event triggers when a user hovers over a gallery item.
 */
export interface GalleryHoverEventArgs extends BaseEventArgs {
    /**
     *  Provides the original event.
     */
    event: Event;
    /**
     *  Specifies name of the event.
     */
    name: string;
    /**
     *  Provides gallery item.
     */
    item: RibbonGalleryItemModel;
}

/**
 * Event triggers before rendering each gallery item.
 */
export interface GalleryItemEventArgs extends BaseEventArgs {
    /**
     *  Specifies name of the event.
     */
    name: string;
    /**
     *  Provides gallery item.
     */
    item: RibbonGalleryItemModel;
}

/**
 * Event triggers before selecting gallery item.
 */
export interface GalleryBeforeSelectEventArgs extends BaseEventArgs {
    /**
     *  Provides the previous selected gallery item.
     */
    previousItem: RibbonGalleryItemModel;
    /**
     *  Provides the current selecting gallery item.
     */
    currentItem: RibbonGalleryItemModel;
    /**
     *  Defines whether to cancel the selecting event or not.
     */
    cancel: boolean;
    /**
     *  Specifies name of the event.
     */
    name: string;
    /**
     *  Provides whether the change is triggered by user interaction.
     */
    isInteracted: boolean;
    /**
     *  Provides the original event.
     */
    event: Event;
}

/**
 * Event triggers after selected gallery item.
 */
export interface GallerySelectEventArgs extends BaseEventArgs {
    /**
     *  Provides the previous selected gallery item.
     */
    previousItem: RibbonGalleryItemModel;
    /**
     *  Provides the current selected gallery item.
     */
    currentItem: RibbonGalleryItemModel;
    /**
     *  Specifies name of the event.
     */
    name: string;
    /**
     *  Provides whether the change is triggered by user interaction.
     */
    isInteracted: boolean;
    /**
     *  Provides the original event.
     */
    event: Event;
}

/** @hidden */
export interface itemProps {
    item?: RibbonItemModel;
    collection?: RibbonCollectionModel;
    group?: RibbonGroupModel;
    element?: HTMLElement;
    tabIndex?: number;
    groupIndex?: number;
    collectionIndex?: number;
    itemIndex?: number;
}

/** @hidden */
export interface commonProperties {
    enableRtl?: boolean;
    enablePersistence?: boolean;
    locale?: string;
}

/** @hidden */
export interface EJ2Control {
    destroy(): void;
    setProperties(prop: Object, muteOnChange?: boolean): void;
}

/**
 * @hidden
 */
export interface ribbonItemPropsList {
    items?: RibbonItemModel[];
    collections?: RibbonCollectionModel[];
    groups?: RibbonGroupModel[];
    id?: string;
    setProperties?: Function;
}

/**
 * @hidden
 */
export interface ribbonTooltipData {
    id: string,
    data: RibbonTooltipModel
}

/**
 * @hidden
 */
export interface KeyTipDataType {
    id: string,
    keyTip: string,
    type: string
}

/**
 * @hidden
 */
export interface KeyTipElements {
    [key: string]: object
}
