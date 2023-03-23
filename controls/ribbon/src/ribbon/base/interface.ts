import { BaseEventArgs } from '@syncfusion/ej2-base';
import { RibbonCollectionModel, RibbonGroupModel, RibbonItemModel, RibbonTooltipModel } from '../models';

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
     * The item appears in the simplified layout group.
     */
    Simplified = 1 << 1,
    /**
     * The item appears in overflow popup.
     */
    Overflow = 1 << 0,
    /**
     * The item appears in both simplified layout group and overflow popup based on ribbon overflow state.
     */
    Auto = Simplified | Overflow,
    /**
     * The item is hidden in simplified mode.
     */
    None = 0
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
     * Renders the template content as ribbon item.
     */
    Template = 'Template'
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
 * Event Triggers when the launcher icon is clicked.
 */
export interface LauncherClickEventArgs extends BaseEventArgs {
    /**
     *  Provides the ID of the group in which the launcher icon is present.
     */
    groupId: string;
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
