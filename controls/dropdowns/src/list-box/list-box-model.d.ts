import { Input, InputObject } from '@syncfusion/ej2-inputs';import { DropDownBase, dropDownBaseClasses, FilteringEventArgs, SelectEventArgs } from '../drop-down-base/drop-down-base';import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';import { EventHandler, closest, removeClass, addClass, Complex, Property, ChildProperty, BaseEventArgs, L10n } from '@syncfusion/ej2-base';import { ModuleDeclaration, NotifyPropertyChanges, getComponent, EmitType, Event, extend, detach, attributes } from '@syncfusion/ej2-base';import { getUniqueID, Browser, formatUnit, isNullOrUndefined, getValue } from '@syncfusion/ej2-base';import { prepend, append } from '@syncfusion/ej2-base';import { cssClass, Sortable, moveTo } from '@syncfusion/ej2-lists';import { Button } from '@syncfusion/ej2-buttons';import { createSpinner, showSpinner, hideSpinner, getZindexPartial } from '@syncfusion/ej2-popups';import { DataManager, Query } from '@syncfusion/ej2-data';
import {SelectionMode,CheckBoxPosition,ToolBarPosition,BeforeItemRenderEventArgs,ListBoxChangeEventArgs,DropEventArgs,DragEventArgs} from "./list-box";
import {DropDownBaseModel} from "../drop-down-base/drop-down-base-model";

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * Specifies the selection modes. The possible values are
     * * `Single`: Allows you to select a single item in the ListBox.
     * * `Multiple`: Allows you to select more than one item in the ListBox.
     *
     * @default 'Multiple'
     */
    mode?: SelectionMode;

    /**
     * If 'showCheckbox' is set to true, then 'checkbox' will be visualized in the list item.
     *
     * @default false
     */
    showCheckbox?: boolean;

    /**
     * Allows you to either show or hide the selectAll option on the component.
     *
     * @default false
     */
    showSelectAll?: boolean;

    /**
     * Set the position of the checkbox.
     *
     * @default 'Left'
     */
    checkboxPosition?: CheckBoxPosition;

}

/**
 * Interface for a class ToolbarSettings
 */
export interface ToolbarSettingsModel {

    /**
     * Specifies the list of tools for dual ListBox.
     * The predefined tools are 'moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', and 'moveAllFrom'.
     *
     * @default []
     */
    items?: string[];

    /**
     * Positions the toolbar before/after the ListBox.
     * The possible values are:
     * * Left: The toolbar will be positioned to the left of the ListBox.
     * * Right: The toolbar will be positioned to the right of the ListBox.
     *
     * @default 'Right'
     */
    position?: ToolBarPosition;

}

/**
 * Interface for a class ListBox
 */
export interface ListBoxModel extends DropDownBaseModel{

    /**
     * Sets the CSS classes to root element of this component, which helps to customize the
     * complete styles.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Sets the specified item to the selected state or gets the selected item in the ListBox.
     *
     * @default []
     * @aspType object
     * @isGenericType true
     */
    value?: string[] | number[] | boolean[];

    /**
     * Sets the height of the ListBox component.
     *
     * @default ''
     */
    height?: number | string;

    /**
     * If 'allowDragAndDrop' is set to true, then you can perform drag and drop of the list item.
     * ListBox contains same 'scope' property enables drag and drop between multiple ListBox.
     *
     * @default false
     */
    allowDragAndDrop?: boolean;

    /**
     * Sets limitation to the value selection.
     * based on the limitation, list selection will be prevented.
     *
     * @default 1000
     */
    maximumSelectionLength?: number;

    /**
     * To enable the filtering option in this component.
     * Filter action performs when type in search box and collect the matched item through `filtering` event.
     * If searching character does not match, `noRecordsTemplate` property value will be shown.
     *
     * @default false
     */
    allowFiltering?: boolean;

    /**
     * Defines the scope value to group sets of draggable and droppable ListBox.
     * A draggable with the same scope value will be accepted by the droppable.
     *
     * @default ''
     */
    scope?: string;

    /**
     * When set to ‘false’, consider the `case-sensitive` on performing the search to find suggestions.
     * By default consider the casing.
     *
     * @default true
     * @private
     */
    ignoreCase?: boolean;

    /**
     * Accepts the value to be displayed as a watermark text on the filter bar.
     *
     * @default null
     */
    filterBarPlaceholder?: string;

    /**
     * Triggers while rendering each list item.
     *
     * @event beforeItemRender
     * @blazorProperty 'OnItemRender'
     */
    beforeItemRender?: EmitType<BeforeItemRenderEventArgs>;

    /**
     * Triggers on typing a character in the component.
     *
     * @event filtering
     * @blazorProperty 'ItemSelected'
     */
    filtering?: EmitType<FilteringEventArgs>;

    /**
     * Triggers when an item in the popup is selected by the user either with mouse/tap or with keyboard navigation.
     *
     * @event select
     * @private
     */
    select?: EmitType<SelectEventArgs>;

    /**
     * Triggers while select / unselect the list item.
     *
     * @event change
     * @blazorProperty 'ValueChange'
     */
    change?: EmitType<ListBoxChangeEventArgs>;

    /**
     * Triggers before dropping the list item on another list item.
     *
     * @event beforeDrop
     * @blazorProperty 'OnDrop'
     */
    beforeDrop?: EmitType<DropEventArgs>;

    /**
     * Triggers after dragging the list item.
     *
     * @event dragStart
     * @blazorProperty 'DragStart'
     */
    dragStart?: EmitType<DragEventArgs>;

    /**
     * Triggers while dragging the list item.
     *
     * @event drag
     * @blazorProperty 'Dragging'
     */
    drag?: EmitType<DragEventArgs>;

    /**
     * Triggers before dropping the list item on another list item.
     *
     * @event drop
     * @blazorProperty 'Dropped'
     */
    drop?: EmitType<DragEventArgs>;

    /**
     * Triggers when data source is populated in the list.
     *
     * @event dataBound
     * @private
     */
    dataBound?: EmitType<Object>;

    /**
     * Accepts the template design and assigns it to the group headers present in the list.
     *
     * @default null
     * @private
     */
    groupTemplate?: string;

    /**
     * Accepts the template and assigns it to the list content of the ListBox component
     * when the data fetch request from the remote server fails.
     *
     * @default 'Request Failed'
     * @private
     */
    actionFailureTemplate?: string;

    /**
     * specifies the z-index value of the component popup element.
     *
     * @default 1000
     * @private
     */
    zIndex?: number;

    /**
     * ignoreAccent set to true, then ignores the diacritic characters or accents when filtering.
     *
     * @private
     */
    ignoreAccent?: boolean;

    /**
     * Specifies the toolbar items and its position.
     *
     * @default { items: [], position: 'Right' }
     */
    toolbarSettings?: ToolbarSettingsModel;

    /**
     * Specifies the selection mode and its type.
     *
     * @default { mode: 'Multiple', type: 'Default' }
     */
    selectionSettings?: SelectionSettingsModel;

}